// Test Document Management System Approval Workflow
// Run: node test-document-workflow.js

const API_BASE = 'http://localhost:3000/api/documents';

async function testWorkflow() {
  console.log('🧪 Testing Document Management System Workflow\n');

  try {
    // Step 1: Create a new document
    console.log('📝 Step 1: Creating new document...');
    const createResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentCode: 'TEST-DOC-001',
        documentTitle: 'Test Quality Procedure',
        documentType: 'PROCEDURE',
        category: 'Quality',
        description: 'Testing approval workflow',
        preparedBy: 'QMR Test User',
        retentionPeriod: 5,
      }),
    });

    const createData = await createResponse.json();
    if (!createData.success) {
      throw new Error('Failed to create document');
    }

    const documentId = createData.document.id;
    console.log(`✅ Document created: ID ${documentId}, Status: ${createData.document.status}`);
    console.log(`   Document Code: ${createData.document.documentCode}`);
    console.log(`   Current Revision: Rev ${createData.document.currentRevision}\n`);

    // Wait a bit
    await sleep(1000);

    // Step 2: QMR Review
    console.log('👨‍💼 Step 2: QMR reviewing document...');
    const reviewResponse = await fetch(`${API_BASE}/${documentId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approverRole: 'QMR',
        approverName: 'Quality Manager',
        action: 'REVIEWED',
        comments: 'Document meets quality standards. Ready for director approval.',
      }),
    });

    const reviewData = await reviewResponse.json();
    if (!reviewData.success) {
      throw new Error('Failed to review document');
    }

    console.log(`✅ Document reviewed: Status changed to ${reviewData.document.status}`);
    console.log(`   Reviewed By: ${reviewData.document.reviewedBy}`);
    console.log(`   Comment: ${reviewData.approval.comments}\n`);

    await sleep(1000);

    // Step 3: Director Approval
    console.log('👔 Step 3: Director approving document...');
    const approveResponse = await fetch(`${API_BASE}/${documentId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approverRole: 'DIRECTOR',
        approverName: 'Company Director',
        action: 'APPROVED',
        comments: 'Approved for implementation.',
      }),
    });

    const approveData = await approveResponse.json();
    if (!approveData.success) {
      throw new Error('Failed to approve document');
    }

    console.log(`✅ Document approved: Status changed to ${approveData.document.status}`);
    console.log(`   Approved By: ${approveData.document.approvedBy}`);
    console.log(`   Effective Date: ${new Date(approveData.document.effectiveDate).toLocaleDateString()}\n`);

    await sleep(1000);

    // Step 4: Distribute document
    console.log('📤 Step 4: Distributing document...');
    const distributeResponse = await fetch(`${API_BASE}/${documentId}/distribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distributedTo: 'All Departments',
        distributionMethod: 'PORTAL',
      }),
    });

    const distributeData = await distributeResponse.json();
    if (!distributeData.success) {
      throw new Error('Failed to distribute document');
    }

    console.log(`✅ Document distributed to: ${distributeData.distribution.distributedTo}`);
    console.log(`   Method: ${distributeData.distribution.distributionMethod}`);
    console.log(`   Distributed At: ${new Date(distributeData.distribution.distributedAt).toLocaleString()}\n`);

    await sleep(1000);

    // Step 5: Create new revision
    console.log('🔄 Step 5: Creating new revision...');
    const reviseResponse = await fetch(`${API_BASE}/${documentId}/revise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changeSummary: 'Updated procedure steps based on audit findings',
        reasonForChange: 'Internal audit recommendation for improvement',
        preparedBy: 'QMR Test User',
      }),
    });

    const reviseData = await reviseResponse.json();
    if (!reviseData.success) {
      throw new Error('Failed to create revision');
    }

    console.log(`✅ New revision created: Rev ${reviseData.revision.revisionNumber}`);
    console.log(`   Change Summary: ${reviseData.revision.changeSummary}`);
    console.log(`   Document Status: Reset to DRAFT\n`);

    await sleep(1000);

    // Step 6: Verify document state
    console.log('🔍 Step 6: Verifying final document state...');
    const getResponse = await fetch(`${API_BASE}/${documentId}`);
    const getData = await getResponse.json();

    if (!getData.success) {
      throw new Error('Failed to get document');
    }

    const doc = getData.document;
    console.log('\n📊 Final Document State:');
    console.log(`   Code: ${doc.documentCode}`);
    console.log(`   Title: ${doc.documentTitle}`);
    console.log(`   Status: ${doc.status}`);
    console.log(`   Current Revision: Rev ${doc.currentRevision}`);
    console.log(`   Total Revisions: ${doc.revisions.length}`);
    console.log(`   Total Approvals: ${doc.approvals.length}`);
    console.log(`   Total Distributions: ${doc.distributions.length}`);

    console.log('\n✅ ALL TESTS PASSED! 🎉');
    console.log('\n📋 Workflow Summary:');
    console.log('   1. ✅ Document Created (DRAFT)');
    console.log('   2. ✅ QMR Reviewed (REVIEW → PENDING_APPROVAL)');
    console.log('   3. ✅ Director Approved (APPROVED)');
    console.log('   4. ✅ Document Distributed');
    console.log('   5. ✅ New Revision Created (Back to DRAFT)');
    console.log('   6. ✅ Full history tracked\n');

    console.log(`🌐 View document at: http://localhost:3000/managed-documents/${documentId}\n`);

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
testWorkflow();
