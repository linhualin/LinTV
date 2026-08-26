/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { getConfig } from '@/lib/config';

export const runtime = 'nodejs';

// 预设默认的 IPTV M3U 目录源
const DEFAULT_IPTV_SOURCES = [
  {
    key: 'iptv-org-category',
    name: 'IPTV 全球分类直播源',
    url: 'https://iptv-org.github.io/iptv/index.category.m3u',
    from: 'config',
    disabled: false
  }
];

export async function GET(request: NextRequest) {
  console.log(request.url);
  try {
    const config = await getConfig();

    // 显式标注类型为 any[]，解决 TypeScript 部署打包时的 类型报错
    const rawSources: any[] = config?.LiveConfig && config.LiveConfig.length > 0 
      ? config.LiveConfig 
      : DEFAULT_IPTV_SOURCES;

    // 过滤出未禁用的直播源
    const liveSources = rawSources.filter((source: any) => !source.disabled);

    return NextResponse.json({
      success: true,
      data: liveSources
    });
  } catch (error) {
    console.error('获取直播源失败:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_IPTV_SOURCES
    });
  }
}
