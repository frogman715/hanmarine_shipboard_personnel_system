'use client';

import Link from 'next/link';

interface WorkflowStep {
  number: number;
  title: string;
  description: string;
  link: string;
  icon: string;
  color: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    number: 1,
    title: 'RECRUITMENT',
    description: 'Cari dan select crew sesuai kebutuhan vessel',
    link: '/applications',
    icon: '📝',
    color: 'blue'
  },
  {
    number: 2,
    title: 'DATA COLLECTION',
    description: 'Kumpulkan dokumen dan sertifikat crew',
    link: '/crew',
    icon: '📂',
    color: 'purple'
  },
  {
    number: 3,
    title: 'DOCUMENTATION',
    description: 'Scan dan input data ke sistem',
    link: '/onboarding',
    icon: '📄',
    color: 'indigo'
  },
  {
    number: 4,
    title: 'CV GENERATION',
    description: 'Generate CV sesuai flag state requirement',
    link: '/cv-generator',
    icon: '📋',
    color: 'cyan'
  },
  {
    number: 5,
    title: 'OWNER APPROVAL',
    description: 'Submit CV ke owner dan tunggu approval',
    link: '/applications',
    icon: '✅',
    color: 'green'
  },
  {
    number: 6,
    title: 'ONBOARDING',
    description: 'Lengkapi checklist dan kontrak kerja',
    link: '/onboarding',
    icon: '📑',
    color: 'teal'
  },
  {
    number: 7,
    title: 'DEPLOYMENT',
    description: 'Crew sign-on dan onboard ke vessel',
    link: '/crew',
    icon: '🚢',
    color: 'blue'
  },
  {
    number: 8,
    title: 'MONITORING',
    description: 'Track certificate expiry dan contract duration',
    link: '/dashboard',
    icon: '📊',
    color: 'orange'
  },
  {
    number: 9,
    title: 'ROTATION',
    description: 'Planning replacement sebelum contract habis',
    link: '/replacement-schedule',
    icon: '🔄',
    color: 'amber'
  },
  {
    number: 10,
    title: 'OFF-BOARDING',
    description: 'Sign-off crew dan proses repatriation',
    link: '/crew',
    icon: '✈️',
    color: 'red'
  }
];

const colorClasses: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100'
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-100'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-100'
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    hover: 'hover:bg-teal-100'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-100'
  }
};

export default function WorkflowGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔄 Complete Crew Management Workflow
        </h2>
        <p className="text-gray-600">
          10 tahap lengkap dari recruitment sampai off-boarding crew
        </p>
      </div>

      {/* Workflow Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {workflowSteps.map((step) => {
          const colors = colorClasses[step.color];

          return (
            <Link
              key={step.number}
              href={step.link}
              className={`
                relative border-2 rounded-lg p-4 transition-all
                ${colors.bg} ${colors.border} ${colors.hover}
                hover:shadow-md hover:scale-105
              `}
            >
              {/* Step Number Badge */}
              <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${colors.text}`}>
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3 text-center">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className={`text-sm font-bold ${colors.text} text-center mb-2 uppercase`}>
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>

              {/* Arrow for flow */}
              {step.number < 10 && (
                <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-300 text-2xl">
                  →
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🚀 Quick Start Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/applications/new"
            className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold text-blue-700 text-sm">New Application</p>
              <p className="text-xs text-blue-600">Mulai recruitment</p>
            </div>
          </Link>

          <Link
            href="/onboarding"
            className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-semibold text-green-700 text-sm">Track Onboarding</p>
              <p className="text-xs text-green-600">Monitor progress</p>
            </div>
          </Link>

          <Link
            href="/crew"
            className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-semibold text-purple-700 text-sm">Manage Crew</p>
              <p className="text-xs text-purple-600">Database crew</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-orange-700 text-sm">View Alerts</p>
              <p className="text-xs text-orange-600">Certificates & Contracts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
