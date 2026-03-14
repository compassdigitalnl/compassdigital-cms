export interface PropertySpecsProps {
  property: {
    buildYear?: number
    livingArea?: number
    plotArea?: number
    rooms?: number
    bedrooms?: number
    energyLabel?: string
    energyLabelExpiry?: string
    heatingType?: string
    hasGarden?: boolean
    gardenArea?: number
    gardenOrientation?: string
    hasGarage?: boolean
    hasParking?: boolean
    parkingType?: string
  }
  className?: string
}
