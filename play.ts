import { nodes } from './src/nodes'

export const node = {
  ...nodes['m5.8xlarge'],
  maxNodes: 1000,
  minNodes: 30
}
