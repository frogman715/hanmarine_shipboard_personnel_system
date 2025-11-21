'use client'

import { useState, useEffect } from 'react'

interface Assignment {
  id: number
  crewName: string
  crewCode: string | null
  seamanBook: string
  rank: string
  vesselName: string
  flag: string
  placement: string
  signOn: string
  signOff: string | null
  status: string
}

interface MonthlyStats {
  domestic: number
  international: number
}

interface SemesterReport {
  year: number
  semester: number
  period: {
    start: string
    end: string
  }
  assignments: Assignment[]
  statistics: {
    totalAssignments: number
    monthlyStats: MonthlyStats[]
  }
}

export default function SemesterReportPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [semester, setSemester] = useState(1)
  const [report, setReport] = useState<SemesterReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const loadReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/export/semester-report?year=${year}&semester=${semester}`)
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Error loading report:', error)
      alert('Failed to load Report Deperla')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/export/semester-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ year, semester })
      })
      
      if (!res.ok) throw new Error('Failed to download report')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `LAPORAN_SEMESTER_${semester}_${year}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download Report Deperla')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [year, semester])

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📋 Report Deperla</h1>
        <p className="text-gray-600">Laporan Semesteran Usaha Keagenan Awak Kapal</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tahun</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={1}>Semester 1 (Jan - Jun)</option>
              <option value={2}>Semester 2 (Jul - Dec)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={downloadReport}
              disabled={downloading || loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {downloading ? '⏳ Downloading...' : '📥 Download Excel'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl">⏳ Loading report...</div>
        </div>
      ) : report ? (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total Assignments</div>
              <div className="text-2xl font-bold text-blue-600">
                {report.statistics.totalAssignments}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">International</div>
              <div className="text-2xl font-bold text-green-600">
                {report.statistics.monthlyStats.reduce((sum, m) => sum + m.international, 0)}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Domestic</div>
              <div className="text-2xl font-bold text-orange-600">
                {report.statistics.monthlyStats.reduce((sum, m) => sum + m.domestic, 0)}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Period</div>
              <div className="text-sm font-bold text-purple-600">
                {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📊 Jumlah Pelaut Yang Diberangkatkan</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Bulan</th>
                    <th className="text-right py-2 px-4">Dalam Negeri</th>
                    <th className="text-right py-2 px-4">Luar Negeri</th>
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.statistics.monthlyStats.map((stats, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{monthNames[idx]}</td>
                      <td className="py-2 px-4 text-right">{stats.domestic}</td>
                      <td className="py-2 px-4 text-right">{stats.international}</td>
                      <td className="py-2 px-4 text-right font-medium">
                        {stats.domestic + stats.international}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-50">
                    <td className="py-2 px-4">Total</td>
                    <td className="py-2 px-4 text-right">
                      {report.statistics.monthlyStats.reduce((sum, m) => sum + m.domestic, 0)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {report.statistics.monthlyStats.reduce((sum, m) => sum + m.international, 0)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {report.statistics.monthlyStats.reduce((sum, m) => sum + m.domestic + m.international, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">🚢 Detail Penempatan Pelaut</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium">No</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Nama Pelaut</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Kode Pelaut</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">No. Buku Pelaut</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Jabatan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Nama Kapal</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Bendera</th>
                    <th className="text-center py-3 px-4 text-sm font-medium">Penempatan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Sign On</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Sign Off</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.assignments.map((assignment, idx) => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm">{idx + 1}</td>
                      <td className="py-2 px-4 text-sm font-medium">{assignment.crewName}</td>
                      <td className="py-2 px-4 text-sm">{assignment.crewCode || '-'}</td>
                      <td className="py-2 px-4 text-sm">{assignment.seamanBook || '-'}</td>
                      <td className="py-2 px-4 text-sm">{assignment.rank}</td>
                      <td className="py-2 px-4 text-sm">{assignment.vesselName}</td>
                      <td className="py-2 px-4 text-sm">{assignment.flag}</td>
                      <td className="py-2 px-4 text-sm text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          assignment.placement === 'DN' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {assignment.placement}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {assignment.signOn ? new Date(assignment.signOn).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {assignment.signOff ? new Date(assignment.signOff).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          assignment.status === 'ON BOARD'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}
