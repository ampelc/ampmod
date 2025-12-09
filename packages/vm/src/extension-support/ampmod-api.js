const VERSION = process.env.ampmod_version;

export class AmpMod {
    constructor () {
        this.version = VERSION;
    }

    ampmodWebLoggedIn () {
        return false;
    }
}

export default new AmpMod();
