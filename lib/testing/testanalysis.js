/************************************************************************************/
/*!
 *   @file       testanalyser.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

import AnalysisNode from '../dsp/analysis.js';
import PhoneNode from '../dsp/phone.js';
import bufferutilities from '../core/bufferutils.js';

//==============================================================================
export function testAnalysisNode(){

    const numChannels   = 4;

    /// create an online audio context, for the analyser node
    const audioContext1 = new AudioContext();


    /// create a test buffer
    const sampleRate = audioContext1.sampleRate;
    const bufferSize = 3 * sampleRate; // 3 seconds
    const buffer = audioContext1.createBuffer( numChannels, bufferSize, sampleRate );

    bufferutilities.makeNoise( buffer, 1, 0 );
    bufferutilities.makeNoise( buffer, 2, -6 );

    /// create a buffer source
    const bufferSource = audioContext1.createBufferSource();
    bufferSource.loop = true;

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    const analysisNode = new AnalysisNode( audioContext1 );

    // global references for testing
    window.test = (typeof window.test !== 'undefined'
                   ? window.test
                   : {});

    window.test.analysisNode = analysisNode;
    
    /// configure the analysis node
    {
        // default values
        analysisNode.analyserFftSize = 2048;
        analysisNode.analyserMinDecibels = -100;
        analysisNode.analyserMaxDecibels = -30;
        analysisNode.analyserSmoothingTimeConstant = 0.85;
        analysisNode.voiceMinFrequency = 300;
        analysisNode.voiceMaxFrequency = 4000;
    }

    /// connect the node to the buffer source
    const phoneNode = new PhoneNode( audioContext1 );
    window.test.phoneNode = phoneNode;

    phoneNode.gain = 6;

    bufferSource.connect( phoneNode._input );

    const splitterNode = audioContext1.createChannelSplitter( 4 );

    phoneNode._output.connect( splitterNode );

    splitterNode.connect(analysisNode._input, 1, 0);

    /// connect the node to the destination of the audio context
    analysisNode._output.connect( audioContext1.destination );

    /// start the rendering
    bufferSource.start(0);

    window.setInterval( () => {
        const rms = analysisNode.getRMS();
        console.log(`RMS: ${rms}`);

        const emergence = analysisNode.getVoiceEmergence();
        console.log(`Voice emergence: ${emergence}`);
    }, 100);

}


//==============================================================================
const analysistests = {
    testAnalysisNode,
};

export default analysistests;
