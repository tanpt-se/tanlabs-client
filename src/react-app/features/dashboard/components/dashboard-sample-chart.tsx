'use client';

import { useEffect, useRef } from 'react';

import * as d3 from 'd3';

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardChartVariant = 'bar' | 'line' | 'area' | 'donut';

function readThemeColor(variable: string, fallback: string) {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function renderBarChart(
  root: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: DashboardChartPoint[],
  innerWidth: number,
  innerHeight: number,
  accent: string,
  textSecondary: string,
  border: string,
) {
  const x = d3
    .scaleBand<string>()
    .domain(data.map((point) => point.label))
    .range([0, innerWidth])
    .padding(0.28);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (point) => point.value) ?? 0])
    .nice()
    .range([innerHeight, 0]);

  root
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call((group) => group.selectAll('text').attr('fill', textSecondary))
    .call((group) => group.selectAll('path,line').attr('stroke', border));

  root
    .append('g')
    .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
    .call((group) => group.selectAll('text').attr('fill', textSecondary))
    .call((group) => group.selectAll('path,line').attr('stroke', border));

  root
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (point) => x(point.label) ?? 0)
    .attr('y', (point) => y(point.value))
    .attr('width', x.bandwidth())
    .attr('height', (point) => innerHeight - y(point.value))
    .attr('rx', 6)
    .attr('fill', accent)
    .attr('opacity', 0.9);
}

function renderLineAreaChart(
  root: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: DashboardChartPoint[],
  innerWidth: number,
  innerHeight: number,
  accent: string,
  textSecondary: string,
  border: string,
  filled: boolean,
) {
  const x = d3
    .scalePoint<string>()
    .domain(data.map((point) => point.label))
    .range([0, innerWidth])
    .padding(0.5);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (point) => point.value) ?? 0])
    .nice()
    .range([innerHeight, 0]);

  root
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call((group) => group.selectAll('text').attr('fill', textSecondary))
    .call((group) => group.selectAll('path,line').attr('stroke', border));

  root
    .append('g')
    .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
    .call((group) => group.selectAll('text').attr('fill', textSecondary))
    .call((group) => group.selectAll('path,line').attr('stroke', border));

  const line = d3
    .line<DashboardChartPoint>()
    .x((point) => x(point.label) ?? 0)
    .y((point) => y(point.value))
    .curve(d3.curveMonotoneX);

  if (filled) {
    const area = d3
      .area<DashboardChartPoint>()
      .x((point) => x(point.label) ?? 0)
      .y0(innerHeight)
      .y1((point) => y(point.value))
      .curve(d3.curveMonotoneX);

    root.append('path').datum(data).attr('fill', accent).attr('opacity', 0.18).attr('d', area);
  }

  root
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', accent)
    .attr('stroke-width', 2.5)
    .attr('d', line);

  root
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (point) => x(point.label) ?? 0)
    .attr('cy', (point) => y(point.value))
    .attr('r', 4)
    .attr('fill', accent);
}

function renderDonutChart(
  root: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: DashboardChartPoint[],
  innerWidth: number,
  innerHeight: number,
  accent: string,
  textSecondary: string,
) {
  const radius = Math.min(innerWidth, innerHeight) / 2 - 8;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  const palette = d3.scaleOrdinal<string, string>().range([
    accent,
    d3.color(accent)?.brighter(0.6)?.formatHex() ?? '#4d94ff',
    d3.color(accent)?.brighter(1.2)?.formatHex() ?? '#99c2ff',
    d3.color(accent)?.brighter(1.8)?.formatHex() ?? '#cce0ff',
  ]);

  const pie = d3
    .pie<DashboardChartPoint>()
    .value((point) => point.value)
    .sort(null);

  const arc = d3.arc<d3.PieArcDatum<DashboardChartPoint>>().innerRadius(radius * 0.55).outerRadius(radius);

  const chart = root.append('g').attr('transform', `translate(${centerX},${centerY})`);

  chart
    .selectAll('path')
    .data(pie(data))
    .join('path')
    .attr('d', arc)
    .attr('fill', (_, index) => palette(String(index)))
    .attr('opacity', 0.92);

  const legend = root.append('g').attr('transform', `translate(${Math.max(centerX + radius + 16, 0)},16)`);

  data.forEach((point, index) => {
    const row = legend.append('g').attr('transform', `translate(0,${index * 22})`);
    row
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('rx', 2)
      .attr('fill', palette(String(index)));
    row
      .append('text')
      .attr('x', 16)
      .attr('y', 9)
      .attr('fill', textSecondary)
      .attr('font-size', 12)
      .text(`${point.label} (${point.value}%)`);
  });
}

export function DashboardSampleChart({
  ariaLabel,
  data,
  height = 240,
  variant = 'bar',
}: {
  ariaLabel: string;
  data: DashboardChartPoint[];
  height?: number;
  variant?: DashboardChartVariant;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = svgRef.current;
    if (!container || !svgElement || data.length === 0) {
      return;
    }

    const render = () => {
      const width = container.clientWidth;
      const margin =
        variant === 'donut'
          ? { top: 8, right: 120, bottom: 8, left: 8 }
          : { top: 16, right: 16, bottom: 40, left: 44 };
      const innerWidth = Math.max(width - margin.left - margin.right, 0);
      const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

      const accent = readThemeColor('--color-accent', '#0064e0');
      const textSecondary = readThemeColor('--color-text-secondary', '#4e606f');
      const border = readThemeColor('--color-border', '#d0d7de');

      const svg = d3
        .select(svgElement)
        .attr('width', width)
        .attr('height', height)
        .attr('role', 'img')
        .attr('aria-label', ariaLabel);

      svg.selectAll('*').remove();

      const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      if (variant === 'bar') {
        renderBarChart(root, data, innerWidth, innerHeight, accent, textSecondary, border);
      } else if (variant === 'line') {
        renderLineAreaChart(root, data, innerWidth, innerHeight, accent, textSecondary, border, false);
      } else if (variant === 'area') {
        renderLineAreaChart(root, data, innerWidth, innerHeight, accent, textSecondary, border, true);
      } else {
        renderDonutChart(root, data, innerWidth, innerHeight, accent, textSecondary);
      }
    };

    render();

    const observer = new ResizeObserver(render);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [ariaLabel, data, height, variant]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} />
    </div>
  );
}
