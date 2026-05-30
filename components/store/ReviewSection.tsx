"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/types";
import { cn, formatDate } from "@/lib/utils";

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ReviewSection({
  reviews,
  rating,
  reviewCount,
}: ReviewSectionProps) {
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="text-center md:text-left">
          <p className="text-cream font-mono text-5xl font-bold">
            {rating.toFixed(1)}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.round(rating) ? "fill-gold text-gold" : "text-border"
                )}
              />
            ))}
          </div>
          <p className="text-silver/50 text-sm font-body mt-1">
            {reviewCount} reviews
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-3">
              <span className="text-silver text-xs font-mono w-6">
                {b.star}★
              </span>
              <div className="flex-1 h-2 bg-card border border-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gold"
                />
              </div>
              <span className="text-silver/40 text-xs font-mono w-8 text-right">
                {b.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-silver/40 text-sm font-body text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cream text-sm font-body font-medium">
                      {review.reviewer_name}
                    </span>
                    {review.is_verified && (
                      <span className="text-green-400 text-[10px] font-heading tracking-wider">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "w-3 h-3",
                          j < review.rating
                            ? "fill-gold text-gold"
                            : "text-border"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-silver/30 text-xs font-body">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="text-silver/70 text-sm font-body mt-3 leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
