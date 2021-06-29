// https://stackoverflow.com/a/3809435
export const emailExpression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
export const emailRegex = new RegExp(emailExpression);

export const isUrl = (text: string) => {
  return text.match(emailRegex)
};

export const injectAnchorTags = (sentence: string): string => {
  const arr = sentence.trim().split(' ');
  const builder: string[] = [];
  arr.forEach((word) => {
    if (isUrl(word)) {
      const https = !word.startsWith('http') ? 'https://' : '';
      builder.push(`<a rel="noreferrer" target="_blank" href="${https}${word}">${word}</a>`);
    } else {
      builder.push(word);
    }
  });

  return builder.join(' ');
};
