
export default class FullScreen {
    request() {
        (
            document.documentElement.requestFullscreen
            || document.documentElement.msRequestFullscreen
            || document.documentElement.mozRequestFullScreen
            || document.documentElement.webkitRequestFullscreen
        ).call(
            document.documentElement,
            { navigationUI: "hide" }
        );
    }

    exit() {
        (
            document.exitFullscreen
            || document.msExitFullscreen
            || document.mozExitFullscreen
            || document.webkitExitFullscreen
        ).call(document);
    }

    isFullScreen() {
        return document.isFullScreen || document.msIsFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
    }

    toggle() {
        if (this.isFullScreen()) {
            return this.exit();
        }
        return this.request();
    }
}