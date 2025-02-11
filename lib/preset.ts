export const presets = {
  // 2.35:1 公众号封面
  '001': {
    width: 500,
    height: 212,
    desc: '2.35:1'
  },
  // 1:1
  '002': {
    width: 500,
    height: 500,
    desc: '1:1'
  },
  // 4:3
  '003': {
    width: 500,
    height: 375,
    desc: '4:3'
  },
  // 3:4
  '004': {
    width: 375,
    height: 500,
    desc: '3:4'
  },
  // 16:9
  '005': {
    width: 500,
    height: 281,
    desc: '16:9'
  }
}

export type PresetCode = keyof typeof presets;
