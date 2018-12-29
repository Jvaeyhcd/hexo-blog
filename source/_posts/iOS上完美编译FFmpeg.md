---
title: iOS上完美编译FFmpeg
date: 2016-03-28 21:50:00
tags:
  - iOS
categories: 经验积累
---

## 问题描述

最新在使用FFmpeg的时候遇到了如下的报错信息，但是现在一直都还未找到解决办法。
``` bash
Undefined symbols for architecture arm64:
  "_avcodec_close", referenced from:
      CH264Decoder::~CH264Decoder() in H264Decoder.o
  "_av_init_packet", referenced from:
      CH264Decoder::DecoderFrame(unsigned char*, int, int&, int&) in H264Decoder.o
  "_av_malloc", referenced from:
      CH264Decoder::CreateYUVTab_16() in H264Decoder.o
  "_av_free", referenced from:
      CH264Decoder::DeleteYUVTab() in H264Decoder.o
      CH264Decoder::~CH264Decoder() in H264Decoder.o
  "_av_register_all", referenced from:
      CH264Decoder::CH264Decoder() in H264Decoder.o
  "_avcodec_find_decoder", referenced from:
      CH264Decoder::CH264Decoder() in H264Decoder.o
  "_avcodec_decode_video2", referenced from:
      CH264Decoder::DecoderFrame(unsigned char*, int, int&, int&) in H264Decoder.o
  "_avcodec_open2", referenced from:
      CH264Decoder::CH264Decoder() in H264Decoder.o
  "_avcodec_alloc_context3", referenced from:
      CH264Decoder::CH264Decoder() in H264Decoder.o
  "_avcodec_alloc_frame", referenced from:
      CH264Decoder::CH264Decoder() in H264Decoder.o
ld: symbol(s) not found for architecture arm64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

<!-- more -->

## 解决办法

解决办法，直接上图

{% asset_img 1.png 解决办法%}