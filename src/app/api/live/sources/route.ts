/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { getConfig } from '@/lib/config';

export const runtime = 'nodejs';

// 仅保留您指定的分类直播源
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

    // 如果配置文件中有 LiveConfig 且不为空，使用配置；否则强制使用您指定的单项直播源
    const configSources = (config?.LiveConfig && config.LiveConfig.length > 0)
      ? config.LiveConfig
      : DEFAULT_IPTV_SOURCES;

    // 过滤出非 disabled 的直播源
    const liveSources = configSources.filter(source => !source.disabled);

    return NextResponse.json({
      success: true,
      data: liveSources
    });
  } catch (error) {
    console.error('获取直播源失败:', error);
    // 出错时依然兜底返回您指定的直播源
    return NextResponse.json({
      success: true,
      data: DEFAULT_IPTV_SOURCES
    });
  }
}
