export class PreFlight implements PreFlightParseable {

    readonly version ?: string;
    name: string;
    config : PreFlightProcedure[];

    constructor () {
        
        this.version = '0.0.1';
        this.name = 'Testing';
        this.config = [];
    }

    public fromParseable (parseable : PreFlightParseable): PreFlight {
        return new PreFlight();
    }

}

export interface PreFlightParseable {
    readonly version ?: string;
    name: string;
    config : PreFlightProcedure[];

    fromParseable(parseable: PreFlightParseable) : PreFlightParseable;
}

export class PreFlightProcedure {

}
