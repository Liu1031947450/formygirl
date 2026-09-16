export type Point = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right' | 'forward';
export type Phase = 'playing' | 'room-complete' | 'reveal' | 'proposal' | 'success';

export const WORLD = { width: 480, height: 256 };

export const ROOMS = [
  {
    id: 'spring',
    name: '春日花园',
    season: 'SPRING',
    description: '故事，从遇见你开始',
    message: '遇见你以后，连平凡的日子都开出了花。',
    letter: 'L',
    color: '#89a879',
    points: [{ x: 153, y: 66 }, { x: 153, y: 188 }, { x: 287, y: 188 }],
  },
  {
    id: 'summer',
    name: '夏日池畔',
    season: 'SUMMER',
    description: '想和你一起，慢慢浪费时光',
    message: '想把每一个漫长的夏天，都留给你。',
    letter: 'O',
    color: '#7ea9ac',
    points: [
      { x: 153, y: 67 }, { x: 224, y: 67 }, { x: 248, y: 92 },
      { x: 248, y: 166 }, { x: 224, y: 188 }, { x: 153, y: 188 },
      { x: 130, y: 166 }, { x: 130, y: 92 }, { x: 153, y: 67 },
    ],
  },
  {
    id: 'autumn',
    name: '秋日果园',
    season: 'AUTUMN',
    description: '收藏每一颗，关于你的甜',
    message: '最想收获的幸福，是每天回家都能看见你。',
    letter: 'V',
    color: '#c39a63',
    points: [{ x: 122, y: 68 }, { x: 197, y: 190 }, { x: 272, y: 68 }],
  },
  {
    id: 'winter',
    name: '冬日暖屋',
    season: 'WINTER',
    description: '走过四季，身边仍然是你',
    message: '往后的每一个冬天，都想握着你的手。',
    letter: 'E',
    color: '#969db6',
    points: [
      { x: 263, y: 64 }, { x: 131, y: 64 }, { x: 131, y: 190 },
      { x: 263, y: 190 }, { x: 263, y: 166 }, { x: 158, y: 166 },
      { x: 158, y: 139 }, { x: 242, y: 139 }, { x: 242, y: 115 },
      { x: 158, y: 115 }, { x: 158, y: 88 }, { x: 263, y: 88 },
      { x: 263, y: 64 },
    ],
  },
] as const;

export type Room = (typeof ROOMS)[number];

export function pathLength(points: readonly Point[]): number {
  return points.slice(1).reduce((total, point, index) =>
    total + Math.hypot(point.x - points[index].x, point.y - points[index].y), 0);
}

export function pathPosition(points: readonly Point[], distance: number) {
  let remaining = Math.max(0, distance);
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const next = points[index];
    const length = Math.hypot(next.x - previous.x, next.y - previous.y);
    if (remaining < length || index === points.length - 1) {
      const fraction = Math.min(remaining / length, 1);
      return {
        x: previous.x + (next.x - previous.x) * fraction,
        y: previous.y + (next.y - previous.y) * fraction,
        dx: (next.x - previous.x) / length,
        dy: (next.y - previous.y) / length,
        segment: index - 1,
      };
    }
    remaining -= length;
  }
  return { ...points[0], dx: 0, dy: 1, segment: 0 };
}

export function canAdvance(points: readonly Point[], distance: number, direction: Direction) {
  if (distance >= pathLength(points)) return false;
  if (direction === 'forward') return true;
  const position = pathPosition(points, distance);
  const vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const vector = vectors[direction];
  return position.dx * vector[0] + position.dy * vector[1] > 0.3;
}

export function advanceDistance(distance: number, elapsed: number, total: number) {
  return Math.min(total, Math.max(0, distance) + Math.max(0, Math.min(elapsed, 0.05)) * 62);
}

export function targetOnPath(points: readonly Point[], click: Point, current: number) {
  let nearest = Infinity;
  let target = current;
  let traveled = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const next = points[index];
    const deltaX = next.x - previous.x;
    const deltaY = next.y - previous.y;
    const length = Math.hypot(deltaX, deltaY);
    const fraction = Math.max(0, Math.min(1,
      ((click.x - previous.x) * deltaX + (click.y - previous.y) * deltaY) / (length * length)));
    const candidate = traveled + fraction * length;
    const separation = Math.hypot(click.x - previous.x - fraction * deltaX,
      click.y - previous.y - fraction * deltaY);
    if (candidate > current + 1 && separation < nearest && separation <= 24) {
      nearest = separation;
      target = candidate;
    }
    traveled += length;
  }
  return target;
}

export function letterPoints(points: readonly Point[]) {
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const width = Math.max(...points.map((point) => point.x)) - minX;
  const height = Math.max(...points.map((point) => point.y)) - minY;
  const scale = Math.min(90 / width, 110 / height);
  return points.map((point) =>
    `${(point.x - minX) * scale + (120 - width * scale) / 2},${(point.y - minY) * scale + (140 - height * scale) / 2}`,
  ).join(' ');
}

export function escapePosition(
  area: { width: number; height: number },
  button: { width: number; height: number },
  previous: Point,
  random = Math.random,
): Point {
  const maxX = Math.max(0, area.width - button.width);
  const maxY = Math.max(0, area.height - button.height);
  const candidates = Array.from({ length: 12 }, () => ({ x: random() * maxX, y: random() * maxY }));
  return candidates.reduce((best, candidate) =>
    Math.hypot(candidate.x - previous.x, candidate.y - previous.y)
      > Math.hypot(best.x - previous.x, best.y - previous.y) ? candidate : best);
}
