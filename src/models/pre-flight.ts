/**
 * A model for Pre-Flight procedure files.
 *
 * @export
 * @class PreFlight
 */
export class PreFlight {

    // The preflight version if specified. Otherwise, assumes the latest.
    readonly version ?: string;
    // The name of the preflight.
    name: string;
    // The associated procedures.
    config : [];

    constructor (data : IPreFlight) {
        this.version = data.version || '0.0.1';
        this.name = data.name;
        this.config = data.config;
    }

}

/**
 * A factory.
 *
 * @export
 * @class PreFlightFactory
 */
export class PreFlightFactory {
    
    createPreFlight(data : IPreFlight) : PreFlight;


    public createPreFlight(data: IPreFlight) : PreFlight {
        
        console.log(data);

        return new PreFlight(data);

    }

}

export interface IPreFlight {
    version?: string;
    name: string;
    config: [];
}
