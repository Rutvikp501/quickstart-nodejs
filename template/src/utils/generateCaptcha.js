import svgCaptcha from 'svg-captcha';

export function generateCaptcha() {
  /**
   * @returns {Object} An object with SVG string and text solution
   * Example: { data: '<svg...>', text: 'xYz3' }
   */
  const captcha = svgCaptcha.create({
    size: 5, // number of characters
    noise: 3, // noise lines
    color: true,
    background: '#ccf2ff'
  });
  return captcha;
}
