/************************************************************************************/
/*!
 *   @file       bufferutils.js
 *   @brief      Misc utility functions for AudioBuffer manipulation
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import utils from "./utils.js";

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
 */
function writeTextDataToFile( text, textFile = null ) {
    
    const data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if ( textFile !== null ) {
      window.URL.revokeObjectURL( textFile );
    }

    textFile = window.URL.createObjectURL( data );

    // returns a URL you can use as a href
    return textFile;
};

//==============================================================================
/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * The text file is formatted so that it can be easily copy/paste into Matlab
 * 
 * @type {AudioBuffer} buffer
 */
export function writeBufferToTextFileWithMatlabFormat( buffer ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    const numDecimals = 9;

    for( let i = 0 ; i < numChannels; i++){

        const channel_ = buffer.getChannelData( i );

        text += "channel(" + (i+1) + ", 1:" + numSamples + ") = ";
        text += "...\n";

        text += "[ ";

        for( let j = 0; j < numSamples; j++ ){
            const value = channel_[j];

            const valueAsString = value.toFixed( numDecimals );

            text += valueAsString;
            text += " ";
        }
        text += " ];"

        text += "\n";
    }

    return writeTextDataToFile( text );
}

/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * @type {AudioBuffer} buffer
 */
export function writeBufferToTextFile( buffer ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    const numDecimals = 9;

    for( let i = 0 ; i < numChannels; i++){

        const channel_ = buffer.getChannelData( i );

        text += "channel[" + i + "] = ";
        text += "\n";

        for( let j = 0; j < numSamples; j++ ){
            const value = channel_[j];

            const valueAsString = value.toFixed( numDecimals );

            text += valueAsString;
            text += " ";
        }
        text += "\n";
    }

    return writeTextDataToFile( text );
}

//==============================================================================
/**
 * Fills one channel of an AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {number} value
 */
export function fillChannel( buffer, channelIndex = 0, value = 0.0 ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    /// boundary check
    if( channelIndex < 0 || channelIndex >= numChannels ){
        throw new Error("Invalid channelIndex");
    }

    const channel_ = buffer.getChannelData( channelIndex );

    for( let j = 0; j < numSamples; j++ ){
        channel_[ j ] = value;
    }        

}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 */
export function clearBufferChannel( buffer, channelIndex ){

    fillChannel( buffer, channelIndex, 0.0 );
}

//==============================================================================
/**
 * Fills all channels of a buffer with 0
 * @type {AudioBuffer} buffer
 */
export function clearBuffer( buffer ){

    const numChannels = buffer.numberOfChannels;
    
    for( let i = 0 ; i < numChannels; i++){

        clearBufferChannel( buffer, i );
    }
}

/**
 * Creates a Dirac in one given channel of the AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {int} sampleIndex
 */
export function makeImpulse( buffer, channelIndex = 0, sampleIndex = 0 ){

    const numChannels = buffer.numberOfChannels;
    const numSamples  = buffer.length;

    /// boundary check
    if( channelIndex < 0 || channelIndex >= numChannels ){
        throw new Error("Invalid channelIndex");
    }

    /// boundary check
    if( sampleIndex < 0 || sampleIndex >= numSamples ){
        throw new Error("Invalid sampleIndex");
    }

    /// first clear the channel
    clearBufferChannel( buffer, channelIndex );

    /// then create a Dirac
    const channel_ = buffer.getChannelData( channelIndex );
    channel_[ sampleIndex ] = 1.0;           

}

export function makeNoise( buffer, channelIndex = 0, gain = 0 ){
    const numChannels = buffer.numberOfChannels;

    /// boundary check
    if( channelIndex < 0 || channelIndex >= numChannels ){
        throw new Error("Invalid channelIndex");
    }

    const amplitude = utils.dB2lin(gain);

    const data = buffer.getChannelData(channelIndex);
    data.forEach( (sample, index) => {
        data[index] = amplitude * Math.random() * 2 - 1;
    });
}

//==============================================================================
const bufferutilities = {
	writeBufferToTextFileWithMatlabFormat,
    writeBufferToTextFile,
    clearBufferChannel,
    clearBuffer,
    makeImpulse,
    makeNoise,
    fillChannel,
};

export default bufferutilities;
