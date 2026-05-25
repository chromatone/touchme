import { pitchColor, getCircleCoord, notes } from '~/use/chromatone'
import { useElementBounding, useStorage } from "@vueuse/core";
import { useMidi } from './midi'

const visual = ref()

export const activeScene = useStorage('active-scene', 'Rose')

export function useScene() {
  const { width, height } = useElementBounding(visual)
  return { visual, width, height, activeScene }
}

// Common scene composable to reduce code duplication
export function useSceneBase() {
  const { width, height } = useScene()
  const { midi } = useMidi()

  return {
    width,
    height,
    midi,
    pitchColor,
    getCircleCoord,
    notes
  }
}
