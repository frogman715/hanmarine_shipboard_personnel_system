import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { crewId, formCode } = await request.json();

    if (!crewId || !formCode) {
      return NextResponse.json(
        { error: 'crewId and formCode are required' },
        { status: 400 }
      );
    }

    // Fetch crew data with related records
    const crew = await prisma.crew.findUnique({
      where: { id: parseInt(crewId) },
      include: {
        certificates: true,
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!crew) {
      return NextResponse.json(
        { error: 'Crew not found' },
        { status: 404 }
      );
    }

    // Prepare data for template
    const templateData = prepareTemplateData(crew);

    // Determine file type and template path
    const formMapping = getFormMapping(formCode);
    if (!formMapping) {
      return NextResponse.json(
        { error: 'Form code not found' },
        { status: 404 }
      );
    }

    const templatePath = path.join(
      process.cwd(),
      'public',
      'templates',
      'HGQS',
      formMapping.folder,
      formMapping.file
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: 'Template file not found' },
        { status: 404 }
      );
    }

    // Generate filled document based on file type
    let filledDocument: Buffer;
    const fileExtension = path.extname(formMapping.file).toLowerCase();

    if (fileExtension === '.docx' || fileExtension === '.doc') {
      filledDocument = await fillWordDocument(templatePath, templateData);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      filledDocument = await fillExcelDocument(templatePath, templateData);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Set response headers for file download
    const fileName = `${formCode}_${crew.crewCode}_${Date.now()}${fileExtension}`;
    
    return new NextResponse(filledDocument, {
      headers: {
        'Content-Type': getContentType(fileExtension),
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': filledDocument.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating filled document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function prepareTemplateData(crew: any): Record<string, string> {
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const application = crew.applications?.[0];
  let applicationMetadata: any = {};
  
  if (application?.notes) {
    try {
      applicationMetadata = JSON.parse(application.notes);
    } catch (e) {
      // Notes is not JSON, use as plain text
    }
  }

  // Calculate age
  const age = crew.dateOfBirth 
    ? Math.floor((Date.now() - new Date(crew.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  // Find specific certificates
  const findCert = (name: string) => crew.certificates?.find((c: any) => 
    c.certificateName?.toLowerCase().includes(name.toLowerCase())
  );

  const passport = findCert('passport');
  const seamanBook = findCert('seaman');
  const coc = findCert('competency');
  const medical = findCert('medical');

  return {
    // Personal Information
    crewCode: crew.crewCode || '',
    fullName: crew.fullName || '',
    dateOfBirth: formatDate(crew.dateOfBirth),
    age: age.toString(),
    placeOfBirth: crew.placeOfBirth || '',
    nationality: crew.nationality || '',
    religion: crew.religion || '',
    maritalStatus: crew.maritalStatus || '',
    address: crew.address || '',
    phone: crew.phone || '',
    email: crew.email || '',
    emergencyContact: crew.emergencyContact || '',
    emergencyPhone: crew.emergencyPhone || '',
    
    // Position Information
    rank: crew.rank || '',
    department: crew.department || '',
    vessel: crew.vessel || '',
    status: crew.status || '',
    
    // Application Data
    appliedRank: application?.appliedRank || crew.rank || '',
    applicationDate: formatDate(application?.createdAt),
    availableDate: applicationMetadata.availableDate ? formatDate(new Date(applicationMetadata.availableDate)) : '',
    expectedSalary: applicationMetadata.expectedSalary || '',
    
    // Documents
    passportNumber: passport?.certificateNumber || '',
    passportExpiry: formatDate(passport?.expiryDate),
    seamanBookNumber: seamanBook?.certificateNumber || '',
    seamanBookExpiry: formatDate(seamanBook?.expiryDate),
    cocNumber: coc?.certificateNumber || '',
    cocExpiry: formatDate(coc?.expiryDate),
    medicalNumber: medical?.certificateNumber || '',
    medicalExpiry: formatDate(medical?.expiryDate),
    
    // Interview Scores
    technicalScore: applicationMetadata.interview?.technicalScore?.toString() || '',
    communicationScore: applicationMetadata.interview?.communicationScore?.toString() || '',
    appearanceScore: applicationMetadata.interview?.appearanceScore?.toString() || '',
    motivationScore: applicationMetadata.interview?.motivationScore?.toString() || '',
    interviewNotes: applicationMetadata.interview?.interviewNotes || '',
    interviewer: applicationMetadata.interview?.interviewer || '',
    interviewDate: applicationMetadata.interview?.interviewDate 
      ? formatDate(new Date(applicationMetadata.interview.interviewDate)) 
      : '',
    
    // System Fields
    generatedDate: formatDate(new Date()),
    generatedBy: 'HGQS System',
    companyName: 'PT. HANMARINE GLOBAL INDONESIA',
  };
}

async function fillWordDocument(templatePath: string, data: Record<string, string>): Promise<Buffer> {
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Set the template data
  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    console.error('Error rendering document:', error);
    throw error;
  }

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  return buf;
}

async function fillExcelDocument(templatePath: string, data: Record<string, string>): Promise<Buffer> {
  const workbook = XLSX.readFile(templatePath);
  
  // Iterate through all sheets
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    // Iterate through cells and replace placeholders
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];

        if (cell && cell.v) {
          let cellValue = cell.v.toString();
          
          // Replace all placeholders in format {fieldName}
          Object.entries(data).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            cellValue = cellValue.replace(new RegExp(placeholder, 'g'), value);
          });

          cell.v = cellValue;
          
          // Update formatted value if exists
          if (cell.w) {
            cell.w = cellValue;
          }
        }
      }
    }
  });

  // Write to buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return contentTypes[extension] || 'application/octet-stream';
}

function getFormMapping(formCode: string): { folder: string; file: string } | null {
  const mappings: Record<string, { folder: string; file: string }> = {
    // Crewing Forms
    'HGF-CR-01': { folder: 'CR FORMS', file: 'HGF-CR-01 Document Checklist.doc' },
    'HGF-CR-02': { folder: 'CR FORMS', file: 'HGF-CR-02 Application for Employment.doc' },
    'HGF-CR-03': { folder: 'CR FORMS', file: 'HGF-CR-03 Crew DataBase.xls' },
    'HGF-CR-04': { folder: 'CR FORMS', file: 'HGF-CR-04 Crew Record Book.doc' },
    'HGF-CR-05': { folder: 'CR FORMS', file: 'HGF-CR-05 Crew List.xls' },
    'HGF-CR-06': { folder: 'CR FORMS', file: 'HGF-CR-06 Crew Change Off Signer.doc' },
    'HGF-CR-07': { folder: 'CR FORMS', file: 'HGF-CR-07 Crew Change On Signer.doc' },
    'HGF-CR-08': { folder: 'CR FORMS', file: 'HGF-CR-08 Crew Transit Info.doc' },
    'HGF-CR-09': { folder: 'CR FORMS', file: 'HGF-CR-09 Interview Assessment.doc' },
    'HGF-CR-10': { folder: 'CR FORMS', file: 'HGF-CR-10 Certificate Record.xls' },
    'HGF-CR-11': { folder: 'CR FORMS', file: 'HGF-CR-11 Certificate Monitoring.xls' },
    'HGF-CR-12': { folder: 'CR FORMS', file: 'HGF-CR-12 PreJoining Medical.doc' },
    'HGF-CR-13': { folder: 'CR FORMS', file: 'HGF-CR-13 Crew Performance.doc' },
    'HGF-CR-14': { folder: 'CR FORMS', file: 'HGF-CR-14 Crew Evaluation.doc' },
    'HGF-CR-15': { folder: 'CR FORMS', file: 'HGF-CR-15 POEA Contract.doc' },
    'HGF-CR-16': { folder: 'CR FORMS', file: 'HGF-CR-16 Crew Replacement Plan.xls' },
    'HGF-CR-17': { folder: 'CR FORMS', file: 'HGF-CR-17 Crew Payroll.xls' },
    
    // Admin Forms (selected commonly used ones)
    'HGF-AD-01': { folder: 'AD FORMS', file: 'HGF-AD-01 Meeting Agenda.doc' },
    'HGF-AD-02': { folder: 'AD FORMS', file: 'HGF-AD-02 Meeting Minutes.doc' },
    'HGF-AD-03': { folder: 'AD FORMS', file: 'HGF-AD-03 Training Request.doc' },
    'HGF-AD-04': { folder: 'AD FORMS', file: 'HGF-AD-04 Training Record.doc' },
    'HGF-AD-07': { folder: 'AD FORMS', file: 'HGF-AD-07 Internal Audit Guide.doc' },
    'HGF-AD-08': { folder: 'AD FORMS', file: 'HGF-AD-08 Annual Audit Plan.doc' },
    'HGF-AD-09': { folder: 'AD FORMS', file: 'HGF-AD-09 Internal Audit Report.doc' },
    'HGF-AD-10': { folder: 'AD FORMS', file: 'HGF-AD-10 Corrective Action Request.doc' },
    'HGF-AD-11': { folder: 'AD FORMS', file: 'HGF-AD-11 Preventive Action Request.doc' },
    'HGF-AD-15': { folder: 'AD FORMS', file: 'HGF-AD-15 CPAR Log.xls' },
    
    // Accounting Forms
    'HGF-AC-01': { folder: 'AC FORMS', file: 'HGF-AC-01 Payment Request.doc' },
    'HGF-AC-02': { folder: 'AC FORMS', file: 'HGF-AC-02 Invoice.doc' },
    'HGF-AC-03': { folder: 'AC FORMS', file: 'HGF-AC-03 Receipt.doc' },
  };

  return mappings[formCode] || null;
}
