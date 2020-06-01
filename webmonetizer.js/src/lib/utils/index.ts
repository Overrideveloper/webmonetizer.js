/** Injects monetization meta tag into document
 * @param {string} value - Value of monetization meta tag. Usually unique payment URL.
*/
export function INJECT_META_TAG(value: string) {
    const tag: HTMLMetaElement = document.createElement('meta');
    tag.content = value;
    tag.name = 'monetization'

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const monetizationTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll('meta[name="monetization"]');

    let doesTagExist = false;

    monetizationTags.forEach(monetizationTag => {
        if (monetizationTag.content !== value) {
            monetizationTag.remove();
        } else {
            doesTagExist = true;
        }
    })

    if (!doesTagExist) {
        head.appendChild(tag);
    }
}

/** Removes monetization meta tag from document */
export function REMOVE_META_TAG() {
    const tag = document.querySelector('meta[name="monetization"]') as HTMLMetaElement;

    if (tag) {
        tag.remove();
    }
}

/** Logs browser unsupported warning in console */
export function BROWSER_UNSUPPORTED_WARNING() {
    console.warn('Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser');
}