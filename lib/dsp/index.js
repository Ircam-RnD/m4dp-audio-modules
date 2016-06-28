/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the dsp modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import CascadeNode from './cascade.js';
import AnalysisNode from './analysis.js';
import HeadphonesEqualization from './headphoneequalization.js';
import {TransauralNode, TransauralFeedforwardNode, TransauralShufflerNode} from './transaural.js'
import SumDiffNode from './sumdiff.js'
import VirtualSpeakersNode from './virtualspeakers.js'
import MultichannelGainNode from './multichannelgain.js'
import {CompressorExpanderNode, MultiCompressorExpanderNode} from './compressorexpander.js'
import CompressorWithSideChain from './compressorsidechain.js'
import {RmsMetering,MultiRMSMetering} from './rmsmetering.js'
import PeakLimiterNode from './peaklimiter.js'

export {CascadeNode, 
		AnalysisNode,
	    HeadphonesEqualization,
	    SumDiffNode,
		TransauralNode,
		TransauralFeedforwardNode,
		TransauralShufflerNode,
		VirtualSpeakersNode,
		MultichannelGainNode,
		CompressorExpanderNode,
        MultiCompressorExpanderNode,
        CompressorWithSideChain,
        RmsMetering,
        MultiRMSMetering,
        PeakLimiterNode};
		
