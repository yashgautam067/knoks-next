"use client";

import Modal from "@/components/ui/Modal";
import { SIZE_CHART } from "@/types";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="md">
      <div className="space-y-6">
        <p className="text-silver/70 text-sm font-body">
          Find your perfect fit. Measurements are in inches.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-cream font-heading tracking-widest text-xs uppercase">Size</th>
                <th className="py-3 px-4 text-left text-cream font-heading tracking-widest text-xs uppercase">Waist (inches)</th>
                <th className="py-3 px-4 text-left text-cream font-heading tracking-widest text-xs uppercase">Hip (inches)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SIZE_CHART).map(([size, measurements]) => (
                <tr key={size} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-cream font-mono font-semibold">{size}</td>
                  <td className="py-3 px-4 text-silver font-body">{measurements.waist}</td>
                  <td className="py-3 px-4 text-silver font-body">{measurements.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-border p-4">
          <h4 className="text-cream text-xs font-heading tracking-widest uppercase mb-2">How to Measure</h4>
          <ul className="space-y-1.5 text-silver/60 text-xs font-body">
            <li>• <strong className="text-silver">Waist:</strong> Measure around your natural waistline</li>
            <li>• <strong className="text-silver">Hip:</strong> Measure around the fullest part of your hips</li>
            <li>• If you&apos;re between sizes, we recommend sizing up</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
