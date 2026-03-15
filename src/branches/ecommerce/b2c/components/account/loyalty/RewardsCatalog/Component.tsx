import React from 'react'
import { Gift, Star, ArrowRight, Lock } from 'lucide-react'
import type { RewardsCatalogProps } from './types'

export function RewardsCatalog({ rewards, availablePoints, onRedeemReward }: RewardsCatalogProps) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-extrabold mb-3 flex items-center gap-2 text-navy">
        <Gift className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        Beloningen inwisselen
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rewards.map((reward) => {
          const canAfford = availablePoints >= reward.pointsCost
          const isLocked = reward.locked || !canAfford

          return (
            <div
              key={reward.id}
              className="bg-white border-[1.5px] border-grey-light rounded-xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-primary"
            >
              {/* Visual area */}
              <div
                className="h-20 flex items-center justify-center text-4xl relative"
                style={{ background: 'var(--color-primary-glow)' }}
              >
                {reward.icon}
                {/* Availability tag */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold"
                  style={
                    canAfford && !reward.locked
                      ? { background: 'rgba(0,200,83,0.1)', color: 'var(--color-success)' }
                      : { background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }
                  }
                >
                  {canAfford && !reward.locked
                    ? 'Beschikbaar'
                    : reward.lockReason
                      ? reward.lockReason
                      : `Nog ${(reward.pointsCost - availablePoints).toLocaleString('nl-NL')} pts`}
                </div>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className="text-sm font-bold text-navy">{reward.name}</div>
                {reward.description && (
                  <div className="text-xs text-grey-mid mt-0.5">{reward.description}</div>
                )}
                {reward.value && (
                  <div className="text-xs text-grey-mid mt-0.5">Waarde: €{reward.value}</div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-grey-light">
                  <div
                    className="flex items-center gap-1 text-sm font-extrabold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Star className="w-3.5 h-3.5" />
                    {reward.pointsCost.toLocaleString('nl-NL')}
                  </div>
                  <button
                    onClick={() => !isLocked && onRedeemReward(reward.id, reward.pointsCost)}
                    disabled={isLocked}
                    className="h-8 px-3 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
                    style={
                      isLocked
                        ? { background: '#E8ECF1', color: 'var(--color-grey-mid)', cursor: 'not-allowed' }
                        : {
                            background: 'var(--color-primary)',
                            color: 'white',
                            cursor: 'pointer',
                          }
                    }
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3" />
                        {reward.lockReason ? reward.lockReason : 'Vergrendeld'}
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3 h-3" />
                        Inwisselen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
