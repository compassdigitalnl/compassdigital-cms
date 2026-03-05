'use client'

import React, { createContext, useContext } from 'react'

type FeaturesMap = Record<string, boolean>

const FeaturesContext = createContext<FeaturesMap>({})

export function FeaturesProvider({
  features,
  children,
}: {
  features: FeaturesMap
  children: React.ReactNode
}) {
  return <FeaturesContext.Provider value={features}>{children}</FeaturesContext.Provider>
}

/**
 * Client-side hook to check feature flags.
 * Features are passed from server layout → FeaturesProvider → useFeatures().
 */
export function useFeatures(): FeaturesMap {
  return useContext(FeaturesContext)
}

/**
 * Client-side hook to check if a specific feature is enabled.
 */
export function useFeatureEnabled(feature: string): boolean {
  const features = useContext(FeaturesContext)
  return features[feature] !== false
}
