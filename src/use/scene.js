import { pitchColor, getCircleCoord, notes } from '~/use/chromatone'
import { useElementBounding, useRafFn } from "@vueuse/core";
import SimplexNoise from 'simplex-noise';

const visual = ref()
const { width, height } = useElementBounding(visual)

export function useScene() {
  return { visual, width, height }
}