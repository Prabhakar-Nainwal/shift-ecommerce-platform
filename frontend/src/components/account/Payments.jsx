import React from 'react';

export default function Payments() {
  return (
    <div className="space-y-6 max-w-md mx-auto p-2">
      {/* Sandbox/Testing Environment Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left">
        <div className="flex gap-3 items-start">
          <span className="text-xl leading-none">⚠️</span>
          <div>
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
              Sandbox Mode Active
            </h3>
            <p className="mt-2 text-sm text-amber-800 leading-relaxed">
              This application is connected to a <strong>testing gateway environment</strong>. No real financial transactions will be processed, and real payment credentials will be rejected.
            </p>
            <p className="mt-3 text-xs text-amber-700 font-medium bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/50">
              💡 Tip: You can safely simulate successful checkout sequences using standard mock sandbox test cards (e.g., Visa test numbers).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}