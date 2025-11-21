import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// HGQS Forms Structure following ISO 9001:2015 + MLC 2006
const FORMS_STRUCTURE = {
  crewing: {
    title: 'Crewing Department (HGF-CR)',
    description: 'Forms for crew recruitment, training, and deployment',
    forms: [
      { code: 'HGF-CR-01', title: 'Documents Checklist', file: 'HGF-CR-01 Document check list.xls', pages: 1 },
      { code: 'HGF-CR-02', title: 'Application for Employment', file: 'HGF-CR-02 APPLICATION FOR EMPLOYMENT (1).doc', pages: 1 },
      { code: 'HGF-CR-03', title: 'Checklist for Departing Crew', file: 'HGF-CR-03 CHECKLIST FOR DEPARTING CREW.docx', pages: 1 },
      { code: 'HGF-CR-04', title: 'De-briefing Form', file: 'HGF-CR-04 DE-BRIEFING FORM.xls', pages: 2 },
      { code: 'HGF-CR-05', title: 'Affidavit of Undertaking', file: 'HGF-CR-05 AFFIDAVIT OF UNDERTAKING.docx', pages: 1 },
      { code: 'HGF-CR-06', title: 'Written Oath About Alcohol & Drug', file: 'HGF-CR-06 Written oath about alcohol & drug.docx', pages: 1 },
      { code: 'HGF-CR-07', title: 'Crew Vacation Plan', file: 'HGF-CR-07 CREW VACATION PLAN.doc', pages: 1 },
      { code: 'HGF-CR-08', title: 'Crew Evaluation Report', file: 'HGF-CR-08 CREW EVALUATION REPORT.doc', pages: 1 },
      { code: 'HGF-CR-09', title: 'Record of Interview for Crew', file: 'HGF-CR-09 Record of Interview for Crew.doc', pages: 1 },
      { code: 'HGF-CR-10', title: 'Contract of Employment', file: 'HGF-CR-10 CONTRACT OF EMPLOYMENT.docx', pages: 3 },
      { code: 'HGF-CR-11', title: 'Report of On Board Complaint', file: 'HGF-CR-11 Report of on board Complaint.doc', pages: 1 },
      { code: 'HGF-CR-12', title: 'Crew Education & Training Plan/Result', file: 'HGF-CR-12 Crew Education & Training Plan Result Report.docx', pages: 1 },
      { code: 'HGF-CR-13', title: 'Disembarkation Application', file: 'HGF-CR-13 Disembarkation Application.doc', pages: 1 },
      { code: 'HGF-CR-14', title: 'Management List of Seafarer\'s Documents', file: 'HGF-CR-14 MANAGEMENT LIST OF SEAFARER\'S DOCUMENTS.xls', pages: 1 },
      { code: 'HGF-CR-15', title: 'Result of Medical Advice', file: 'HGF-CR-15 Result of Medical Advice.doc', pages: 1 },
      { code: 'HGF-CR-16', title: 'Medical Treatment Request', file: 'HGF-CR-16 Medical Treatment Request.doc', pages: 2 },
      { code: 'HGF-CR-17', title: 'Notice of Crew On & Off-Signing', file: 'HGF-CR-17 NOTICE OF CREW ON&OFF-SIGNING.xlsx', pages: 1 },
    ]
  },
  admin: {
    title: 'HR/Administration Department (HGF-AD)',
    description: 'Forms for quality management, audits, and HR operations',
    forms: [
      { code: 'HGF-AD-01', title: 'Departmental Meeting', file: 'HGF-AD-01 DEPARTMENTAL MEETING.doc', pages: 1 },
      { code: 'HGF-AD-02', title: 'Management Meeting', file: 'HGF-AD-02 MANAGEMENT MEETING.doc', pages: 2 },
      { code: 'HGF-AD-03', title: 'Evaluation of Supplier', file: 'HGF-AD-03 EVALUATION OF SUPPLIER.doc', pages: 1 },
      { code: 'HGF-AD-04', title: 'Re-evaluation of Supplier', file: 'HGF-AD-04 RE-EVALUATION OF SUPPLIER.doc', pages: 1 },
      { code: 'HGF-AD-05', title: 'Evaluation of Customers', file: 'HGF-AD-05 EVALUATION OF CUSTOMERS.doc', pages: 2 },
      { code: 'HGF-AD-06', title: 'Evaluation of Employee', file: 'HGF-AD-06 EVALUATION OF EMPLOYEE.docx', pages: 3 },
      { code: 'HGF-AD-07', title: 'Internal Audit Guide', file: 'HGF-AD-07 INTERNAL AUDIT GUIDE.docx', pages: 14 },
      { code: 'HGF-AD-08', title: 'Internal Audit Plan', file: 'HGF-AD-08 INTERNAL AUDIT PLAN.doc', pages: 1 },
      { code: 'HGF-AD-09', title: 'Internal Audit Report', file: 'HGF-AD-09 INTERNAL AUDIT REPORT.doc', pages: 3 },
      { code: 'HGF-AD-10', title: 'Corrective and Preventive Action Request', file: 'HGF-AD-10 CORRECTIVE AND PREVENTIVE ACTION REQUEST.doc', pages: 1 },
      { code: 'HGF-AD-11', title: 'Corrective and Preventive Action Report', file: 'HGF-AD-11 CORRECTIVE AND PREVENTIVE ACTION REPORT.doc', pages: 1 },
      { code: 'HGF-AD-12', title: 'Purchase Order', file: 'HGF-AD-12 Purchase Order.xlsx', pages: 1 },
      { code: 'HGF-AD-13', title: 'Release and Quitclaim', file: 'HGF-AD-13 RELEASE AND QUITCLAIM.docx', pages: 1 },
      { code: 'HGF-AD-14', title: 'Orientation for New Employee', file: 'HGF-AD-14 ORIENTATION FOR NEW EMPLOYEE.doc', pages: 1 },
      { code: 'HGF-AD-15', title: 'Report of Non-conformity', file: 'HGF-AD-15 Report of Non-conformity.doc', pages: 1 },
      { code: 'HGF-AD-16', title: 'Index', file: 'HGF-AD-16 INDEX.docx', pages: 1 },
      { code: 'HGF-AD-17', title: 'List of Documents for Dispatching', file: 'HGF-AD-17 LIST OF DOCUMENTS FOR DISPATCHING.docx', pages: 1 },
      { code: 'HGF-AD-19', title: 'List of Record for Control', file: 'HGF-AD-19 LIST OF RECORD FOR CONTROL.docx', pages: 1 },
      { code: 'HGF-AD-20', title: 'Improvement Plan of the Process', file: 'HGF-AD-20 Improvement Plan of the Process.docx', pages: 1 },
      { code: 'HGF-AD-21', title: 'Management Plan of the Process', file: 'HGF-AD-21 Management Plan of the Process.docx', pages: 1 },
      { code: 'HGF-AD-22', title: 'Management Review Result Report', file: 'HGF-AD-22 Management Review Result Report.docx', pages: 1 },
      { code: 'HGF-AD-23', title: 'Management Review Record', file: 'HGF-AD-23 Management Review Record.docx', pages: 2 },
      { code: 'HGF-AD-24', title: 'Management Review Report', file: 'HGF-AD-24 Management Review Report.docx', pages: 1 },
      { code: 'HGF-AD-25', title: 'Manpower Requisition Form', file: 'HGF-AD-25 Manpower Requisition Form.docx', pages: 1 },
    ]
  },
  accounting: {
    title: 'Accounting Department (HGF-AC)',
    description: 'Forms for financial management and crew wage processing',
    forms: [
      { code: 'HGF-AC-01', title: 'Crew Wage Payment Record', file: 'HGF-AC-01 CREW WAGE PAMENT RECORD.xls', pages: 1 },
      { code: 'HGF-AC-02', title: 'Appointments & Official Order', file: 'HGF-AC-02 APPOINTMENTS & OFFICIAL ORDER.xls', pages: 1 },
      { code: 'HGF-AC-03', title: 'Petty Cash Voucher', file: 'HGF-AC-03 Petty Cash Voucher.xlsx', pages: 1 },
      { code: 'HGF-AC-04', title: 'Allotment', file: 'HGF-AC-04 Allotment.xlsx', pages: 1 },
      { code: 'HGF-AC-05', title: 'Statement of Account', file: 'HGF-AC-05 STATEMENT OF ACCOUNT.docx', pages: 2 },
      { code: 'HGF-AC-06', title: 'Monthly Cash Receipt & Disbursement', file: 'HGF-AC-06 MONTHLY CASH RECEIPT & DISBURSEMENT.xls', pages: 1 },
      { code: 'HGF-AC-07', title: 'Monthly Debit Note', file: 'HGF-AC-07 MONTHLY DEBIT NOTE.docx', pages: 1 },
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let result = FORMS_STRUCTURE;

    // Filter by category
    if (category && category !== 'all') {
      result = { [category]: FORMS_STRUCTURE[category as keyof typeof FORMS_STRUCTURE] };
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = Object.entries(result).reduce((acc, [key, cat]) => {
        const filteredForms = cat.forms.filter(form => 
          form.code.toLowerCase().includes(searchLower) ||
          form.title.toLowerCase().includes(searchLower)
        );
        if (filteredForms.length > 0) {
          acc[key] = { ...cat, forms: filteredForms };
        }
        return acc;
      }, {} as typeof FORMS_STRUCTURE);
    }

    // Count totals
    const totals = {
      crewing: FORMS_STRUCTURE.crewing.forms.length,
      admin: FORMS_STRUCTURE.admin.forms.length,
      accounting: FORMS_STRUCTURE.accounting.forms.length,
      total: FORMS_STRUCTURE.crewing.forms.length + 
             FORMS_STRUCTURE.admin.forms.length + 
             FORMS_STRUCTURE.accounting.forms.length
    };

    return NextResponse.json({ 
      success: true, 
      forms: result,
      totals 
    });
  } catch (error: any) {
    console.error('Error listing forms:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
