'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, AreaSeries, CandlestickSeries, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: any[];
  type?: 'area' | 'candlestick';
  latestTick?: any;
  previousClose?: number;
  interval?: string;
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const TradingViewChart = (props: ChartProps) => {
  const {
    data,
    type = 'area',
    latestTick,
    previousClose,
    interval = '1d',
    colors: {
      backgroundColor = 'transparent',
      lineColor = '#2563eb',
      textColor = '#94a3b8',
      areaTopColor = 'rgba(37, 99, 235, 0.2)',
      areaBottomColor = 'rgba(37, 99, 235, 0.05)',
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: '#2563eb',
        },
        horzLine: {
          labelBackgroundColor: '#2563eb',
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    const series = type === 'candlestick' 
      ? chart.addSeries(CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#f43f5e',
          borderVisible: false,
          wickUpColor: '#10b981',
          wickDownColor: '#f43f5e',
        })
      : chart.addSeries(AreaSeries, {
          lineColor,
          topColor: areaTopColor,
          bottomColor: areaBottomColor,
          lineWidth: 2,
        });

    series.setData(data);
    
    // Add Previous Close Line if available
    if (previousClose) {
      series.createPriceLine({
        price: previousClose,
        color: '#94a3b8',
        lineWidth: 1,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Prev Close',
      });
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, type, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, previousClose]);

  // Handle Real-time Ticks
  useEffect(() => {
    if (seriesRef.current && latestTick) {
      seriesRef.current.update(latestTick);
    }
  }, [latestTick]);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[250px]" />;
};
