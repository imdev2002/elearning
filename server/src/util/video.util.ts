import { Sections } from '../global';

const videoUtil = {
  detectPlatform(url: string) {
    if (url.includes('vimeo')) {
      return 'vimeo';
    }
    if (url.includes('twitch')) {
      return 'twitch';
    }
    if (url.includes('rumble')) {
      return 'rumble';
    }
    return 'youtube';
  },
  getThumbnail(url: string) {
    const platform = this.detectPlatform(url);
    if (platform === 'youtube') {
      const videoId = url.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    if (platform === 'vimeo') {
      const videoId = url.split('/').pop();
      return `https://i.vimeocdn.com/video/${videoId}_640.jpg`;
    }
    if (platform === 'twitch') {
      const videoId = url.split('/').pop();
      return `https://static-cdn.jtvnw.net/s3_vods/${videoId}/thumb/thumb0-320x180.jpg`;
    }
    if (platform === 'rumble') {
      const videoId = url.split('/').pop();
      return `https://cdn.rumble.com/v${videoId}/thumb.jpg`;
    }
    return '';
  },
  getFullHDThumbnail(url: string) {
    const platform = this.detectPlatform(url);
    if (platform === 'youtube') {
      const videoId = url.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (platform === 'vimeo') {
      const videoId = url.split('/').pop();
      return `https://i.vimeocdn.com/video/${videoId}_1920x1080.jpg`;
    }
    if (platform === 'twitch') {
      const videoId = url.split('/').pop();
      return `https://static-cdn.jtvnw.net/s3_vods/${videoId}/thumb/thumb0-1920x1080.jpg`;
    }
    if (platform === 'rumble') {
      const videoId = url.split('/').pop();
      return `https://cdn.rumble.com/v${videoId}/thumb.jpg`;
    }
    return '';
  },
  getMaxQualityThumbnail(url: string) {
    const platform = this.detectPlatform(url);
    if (platform === 'youtube') {
      const videoId = url.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (platform === 'vimeo') {
      const videoId = url.split('/').pop();
      return `https://i.vimeocdn.com/video/${videoId}_1280x720.jpg`;
    }
    if (platform === 'twitch') {
      const videoId = url.split('/').pop();
      return `https://static-cdn.jtvnw.net/s3_vods/${videoId}/thumb/thumb0-1280x720.jpg`;
    }
    if (platform === 'rumble') {
      const videoId = url.split('/').pop();
      return `https://cdn.rumble.com/v${videoId}/thumb.jpg`;
    }
    return '';
  },
  addThumbToSections(sections: Sections) {
    for (const section of sections) {
      if (section.type === 'layout') {
        for (const child of section.children) {
          if (child.type === 'video') {
            if (!child.videoSrc.platform) {
              child.videoSrc.platform = this.detectPlatform(child.videoSrc.src);
            }
            if (!child.videoSrc.thumb) {
              child.videoSrc.thumb =
                this.getFullHDThumbnail(child.videoSrc.src) ||
                this.getThumbnail(child.videoSrc.src) ||
                this.getMaxQualityThumbnail(child.videoSrc.src) ||
                '';
            }
          }
        }
      }
    }
    return sections;
  },
};
export default videoUtil;
