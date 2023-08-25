export type AssetPackData = {
  id: string
  name: string
}

export function isAssetPackData(value: any): value is AssetPackData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

export type AssetData = {
  id: string
  name: string
  category: string
  tags: string[]
  components: Record<string, any>
}

export function isAssetData(value: any): value is AssetData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.components === 'object' &&
    value.components !== null
  )
}

export type Asset = AssetData & { contents: Record<string, string> }
export type AssetPack = AssetPackData & { thumbnail: string; assets: Asset[] }
export type Catalog = { assetPacks: AssetPack[] }