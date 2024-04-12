const dataUtil = {
  validateSlug: (slug: string) => {
    if (slug === '') {
      return true;
    }
    if (slug.length < 3) {
      return false;
    }

    for (const char of slug) {
      if (!/[a-z0-9-_.]/.test(char)) {
        return false;
      }
    }

    return true;
  },
  validateBio: (bio: string) => {
    return bio.length <= 500;
  },
};

export default dataUtil;
