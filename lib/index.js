/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the M4DP modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import DialogEnhancement from './dialog-enhancement/index.js';
import MultichannelSpatialiser from './multichannel-spatialiser/index.js';
import NoiseAdaptation from './noise-adaptation/index.js';
import ObjectSpatialiserAndMixer from './object-spatialiser-and-mixer/index.js';
import {OldSmartFader, NewSmartFader} from './smart-fader/index.js';
import {AudioStreamDescriptionCollection, AudioStreamDescription} from './core/index.js';
import StreamSelector from './stream-selector/index.js';
import {OldReceiverMix, NewReceiverMix} from './receiver-mix/index.js';


import {CascadeNode,
        HeadphonesEqualization,
        SumDiffNode,
        LRMSNode,
        CenterEnhancementNode,
        CompressorExpanderNode,
        MultiCompressorExpanderNode,
        CompressorWithSideChain,
        RmsMetering,
        MultiRMSMetering,
        PeakLimiterNode} from './dsp/index.js';

import utilities from './core/utils.js';

import unittests from './testing/index.js';

import binaural from 'binaural';

export {CascadeNode,
		SumDiffNode,
		LRMSNode,
		CenterEnhancementNode,
		HeadphonesEqualization,
		CompressorExpanderNode,
        MultiCompressorExpanderNode,
        CompressorWithSideChain,
        RmsMetering,
        MultiRMSMetering,
        PeakLimiterNode,
		StreamSelector, 
		OldReceiverMix,
        NewReceiverMix,
		DialogEnhancement, 		
		MultichannelSpatialiser, 
		NoiseAdaptation, 
		ObjectSpatialiserAndMixer, 
		OldSmartFader,
        NewSmartFader,
		AudioStreamDescriptionCollection, 
		AudioStreamDescription, 
		utilities,
		unittests,
		binaural};
