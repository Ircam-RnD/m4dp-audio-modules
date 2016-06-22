'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getHrir = getHrir;
exports.testHrtfFromSofaServer = testHrtfFromSofaServer;

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IRC_1147, COMPENSATED, 44.1 kHz
// left ear, navigation = [-30 , 0]
/************************************************************************************/
/*!
 *   @file       testsofa.js
 *   @brief      Misc test functions for SOFA
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

function getLeftTestBuffer() {

	var l_hrir_1 = [1.4132325e-05, -0.00028193564, 0.00067406708, -0.0015438328, 0.002343185, -0.0042546899, 0.0056989877, -0.008909386, 0.013256035, -0.023441048, 0.087901132, 0.11658128, -0.35129103, 0.19038613, -0.2640219, 0.10525886, 0.57169504, -0.092018661, 0.42129788, -0.065709863, -0.07198246, -0.12831281, -0.020194215, -0.086181897, 0.062725271, -0.064106033, -0.01786496, 0.005976978, 0.028849113, -0.078114624, 0.026099128, -0.087937849, 0.0065339186, 0.05093279, 0.030594884, 0.039333248, 0.01397383, 0.015451287, -0.0063663534, -0.031407839, -0.047616841, -0.05624593, -0.076982806, -0.045545539, -0.027926149, 0.0096117733, -0.019553812, -0.0053279059, -0.00072523411, -0.0042109865, 0.007578094, 0.00087990009, -0.0090000561, -0.0025798772, -0.012783602, -0.01307241, -0.008798917, -0.0022054303, -0.0012807811, -0.011876543, -0.0065112824, -0.0027094041, -0.00077164441, 0.0047712326, -0.0091772907, -0.00011162587, -0.0087647848, -0.0019659258, -0.0077792026, 0.0019471927, -0.011084985, -0.0031365027, -0.0081186278, -0.0040242879, 0.018169449, -0.017944612, -0.02320988, 0.025028598, -0.01209448, 0.0140731, 0.025226283, -0.0044313805, -0.02983553, -0.028062748, 0.02292914, -0.0073565672, -0.062286153, -0.016325469, -0.021853672, -0.025748605, 0.039503251, -0.0071338104, -0.012957448, 0.0027250638, 0.00057076822, 0.0088403969, 0.0070754822, 0.0017877444, -0.011529959, -0.0060916068, 0.00039970116, -0.004718351, 0.0021941501, 0.0073960195, 0.0078633152, -0.0037722073, -0.0020280923, 0.0024727472, 0.0040769741, -0.0088956118, -0.013589519, -0.015253273, -0.016183901, -0.014050537, -0.00077704794, -0.010080476, -0.0081755161, -0.00013398205, -0.0011617567, -0.0032983648, 0.001784743, -0.001853997, 0.00086518345, -0.00080255618, -0.0032587134, -0.006735632, -0.0039407294, -0.0023791482, -0.0023593784, -0.004234867, -0.0021589755, -0.0020311512, 0.0028884383, 0.0036012488, 0.0014631257, 0.0018751034, 0.0017227931, 0.00051738804, 0.0021896845, 0.00049943606, 1.0966705e-05, 0.00037674853, -0.00035357145, -0.00014751668, 0.00028273055, 0.0015553956, 0.0014225591, 0.00027374144, 6.608697e-05, 0.00088551602, -0.00023514595, 0.0010984583, -0.00060469367, -0.00070795743, -0.00031130607, -0.00060267295, 0.00023590805, 6.9737479e-05, 0.00020767466, 0.0008352928, 0.00079262047, 0.00097429446, 0.00080321626, 0.00070339281, 0.0015355398, 0.001640927, 0.0018574026, 0.0025194618, 0.0022518159, 0.002439559, 0.0025438101, 0.0025306775, 0.0012282241, 0.00076979102, 0.0016917955, 0.00020163211, 0.0013003565, 0.0011392531, 0.00034046515, 0.00092837517, 0.0013007193, 0.0025138302, 0.00225188, 0.00037036302, 0.0012363485, 0.001418706, -0.00033464148, -0.0011334823, -0.0023804675, -0.00084712007, 0.00047495138, -0.00088687785, -0.0008213348, -0.0015033938, -0.00034491047, 0.0028352889, 0.0015820507, -0.00045588497, 0.0019047109, 0.0016433937, 0.0023967951, 0.0030677286, 0.0016212255, 0.00067536607, 0.00056772145, 0.0023526029, 0.0023253294, 0.001265578, 0.0018626356, 0.0025865504, 0.0019152023, 0.0027284475, 0.0031230506, 0.0026063655, 0.0022076346, 0.0031534104, 0.0022533534, 0.002360121, 0.0023081289, 0.0015604217, 0.00028087266, 0.0012829569, 0.0025858152, 0.0024347331, 0.0024768574, 0.0019402217, 0.0019329428, 0.0017125467, 0.0021164292, 0.0023189209, 0.0022441678, 0.002281207, 0.0019270001, 0.0019101536, 0.0019457384, 0.0020941367, 0.0021620486, 0.0022751852, 0.002181841, 0.0021200512, 0.0021993275, 0.0022301065, 0.0022912639, 0.0023209664, 0.0023138248, 0.0022012276, 0.0022802624, 0.0023726213, 0.0023012339, 0.0023521343, 0.0023377394, 0.002329234, 0.0023337045, 0.0023899119, 0.0023956238, 0.0023943337, 0.0024504968, 0.0024591743, 0.002379553, 0.0023931324, 0.0024138623, 0.0024429628, 0.0024506776, 0.0024294081, 0.0025010581, 0.0024492333, 0.0024117822, 0.0025161464, 0.0024681916, 0.0024792035, 0.0025135702, 0.002509866, 0.0024992894, 0.0023943188, 0.0024773506, 0.0025059016, 0.0024466945, 0.0025561351, 0.0024834416, 0.0024270383, 0.0025362142, 0.0024925992, 0.0025092834, 0.0025545123, 0.0024576699, 0.0024201599, 0.0024324636, 0.002444449, 0.0024545475, 0.0024346217, 0.0024273692, 0.0024091401, 0.0024106196, 0.0024468292, 0.0024578748, 0.0025000462, 0.0025032307, 0.0024541375, 0.0024677904, 0.0024722175, 0.0024659798, 0.0024948565, 0.0024845532, 0.0024656299, 0.0024793853, 0.0024802626, 0.0024924863, 0.0024986545, 0.0025015132, 0.0024999871, 0.0024926892, 0.002497768, 0.0024802209, 0.0024757889, 0.0024738991, 0.0024496608, 0.0024471857, 0.0024370001, 0.0024280072, 0.0024337007, 0.0024232517, 0.0024193624, 0.0024188729, 0.0024099797, 0.0024108243, 0.0024010682, 0.0023983161, 0.0023935951, 0.0023798536, 0.0023811779, 0.0023638962, 0.0023584906, 0.0023653113, 0.0023514024, 0.0023506768, 0.002346809, 0.0023374804, 0.0023433229, 0.002335763, 0.0023318705, 0.0023264555, 0.002316075, 0.0023173819, 0.0023068362, 0.0023026365, 0.0023019171, 0.0022877156, 0.0022910339, 0.0022854109, 0.0022738959, 0.0022733597, 0.0022602595, 0.0022586726, 0.0022559675, 0.0022442002, 0.002240857, 0.0022253136, 0.0022201978, 0.0022185263, 0.0022005082, 0.0021990985, 0.0021900658, 0.0021771229, 0.0021779418, 0.0021645466, 0.0021572173, 0.0021508015, 0.0021399013, 0.0021412745, 0.0021259733, 0.002116817, 0.002115298, 0.0021022752, 0.0021016962, 0.0020932519, 0.0020825594, 0.002081538, 0.0020692666, 0.0020663853, 0.0020613294, 0.0020515068, 0.0020524276, 0.0020412507, 0.0020334773, 0.0020275079, 0.0020184131, 0.0020162555, 0.0020037346, 0.0019976744, 0.0019928761, 0.0019750451, 0.0019736669, 0.0019652988, 0.0019522491, 0.0019495258, 0.0019341785, 0.0019279217, 0.0019206054, 0.0019060989, 0.0019051637, 0.0018904792, 0.0018807618, 0.0018779237, 0.0018601919, 0.0018578088, 0.0018488808, 0.0018353839, 0.0018325771, 0.0018178601, 0.0018132888, 0.0018066897, 0.0017923985, 0.001791381, 0.0017780474, 0.0017700043, 0.0017673612, 0.0017524239, 0.0017501613, 0.0017394455, 0.0017276664, 0.0017270026, 0.0017126261, 0.0017079723, 0.0017010197, 0.0016870315, 0.0016859443, 0.0016727244, 0.0016656708, 0.001661932, 0.0016466513, 0.0016445389, 0.0016333183, 0.0016223732, 0.0016213635, 0.0016064604, 0.0016017837, 0.0015940824, 0.001580486, 0.0015792676, 0.0015656264, 0.0015588572, 0.0015541604, 0.0015389375, 0.0015372586, 0.001525836, 0.0015157399, 0.0015137158, 0.0014985183, 0.0014950168, 0.001486801, 0.0014739018, 0.0014729755, 0.001458909, 0.0014526821, 0.0014479139, 0.0014332436, 0.0014318913, 0.0014202454, 0.0014109932, 0.0014086943, 0.0013935839, 0.0013909494, 0.0013824579, 0.0013702119, 0.0013694038, 0.0013553578, 0.0013499712, 0.0013449543, 0.001331045, 0.0013301002, 0.0013183484, 0.0013100663, 0.0013074225, 0.0012931439, 0.0012909019, 0.0012825466, 0.0012704581, 0.0012711589, 0.0012547963, 0.0012541793, 0.0012432118, 0.001260351, 0.0012651742, 0.0011898277, 0.0012121985, 0.0011467912, 0.001190836, 0.0012960485, 0.0012957851, 0.00137487, 0.0013533976, 0.0013261806, 0.0012895107, 0.0012720223, 0.0012509781, 0.0012517398, 0.0012316866, 0.0012200168, 0.0012147902, 0.0012115598, 0.0011884508, 0.0011828257, 0.0011572048, 0.001152301, 0.0011577943, 0.0011595037, 0.0011610896, 0.0011592228, 0.0011544405, 0.001145801, 0.0011302032, 0.0011103414, 0.0010884807, 0.0010624005, 0.0010437097, 0.0010316636, 0.0010250325, 0.0010146388, 0.0010063865, 0.00099888219, 0.00099232371, 0.00098659229, 0.00098013715, 0.00097178101, 0.00096331966, 0.00095429316, 0.00094382654, 0.0009352253, 0.000928641, 0.00092058906, 0.00091184622, 0.00090372161, 0.00089591584, 0.00089065344, 0.00088376279, 0.00087615295, 0.00086932036, 0.0008604701, 0.00085405582, 0.00084575095, 0.00083930525, 0.00083122509, 0.00082305679, 0.00081547156, 0.00080905689, 0.00080592979, 0.00079543327, 0.00078491522, 0.00078376031, 0.0007756691, 0.00077368799, 0.00077327282, 0.00076556101, 0.00075145489, 0.00074082488, 0.00073907934, 0.00072966698, 0.00070942925, 0.00069919749, 0.0006867929, 0.00067751247, 0.00067955473, 0.00067219669, 0.00066383089, 0.00065863181, 0.00065346753, 0.00065020049, 0.00064618855, 0.00064087363, 0.00063238562, 0.00062573618, 0.00061997955, 0.00061362004, 0.00060894745, 0.00060553288, 0.00060170954, 0.00059567854, 0.00058975548, 0.00058542346, 0.00058062076, 0.00057298977, 0.00056428224, 0.00055498824, 0.00054558277, 0.00053744366, 0.00053149546, 0.00052403183, 0.00051707499, 0.00051189146, 0.00050656558, 0.00050090136, 0.00049627311, 0.00049104949, 0.00048623429, 0.00048118162, 0.00047532785, 0.00046889154, 0.00046317813, 0.00045773227, 0.00045237058, 0.0004466226, 0.00044135139, 0.00043641006, 0.00043250529, 0.00042879763, 0.00042465621, 0.00042055884, 0.00041652026, 0.00041218941, 0.00040826413, 0.00040395274, 0.00039951655, 0.00039525394, 0.00039078628, 0.00038639563, 0.00038227564, 0.00037828917, 0.00037441069, 0.00037022621, 0.00036604239, 0.00036207505, 0.0003578722, 0.00035394471, 0.00034969687, 0.00034539505, 0.0003412672, 0.00033708113, 0.00033309664, 0.00032914256, 0.00032521773, 0.00032150832, 0.00031779163, 0.00031413383, 0.00031048266, 0.00030680773, 0.00030341003, 0.00030003638, 0.00029674968, 0.00029367275, 0.00029049759, 0.00028744553, 0.00028444402, 0.00028136304, 0.00027806757, 0.00027467924, 0.00027143576, 0.00026800854, 0.00026475314, 0.00026150194, 0.00025813242, 0.00025484846, 0.00025180255, 0.00024899565, 0.00024608272, 0.00024285408, 0.00023978163, 0.00023673459, 0.00023331418, 0.00022963275, 0.0002257992, 0.00022234468, 0.00021914099, 0.00021570684, 0.00021224273, 0.00020869845, 0.00020556199, 0.00020309383, 0.00020029842, 0.00019717804, 0.00019456944, 0.00019195216, 0.00018957534, 0.00018729103, 0.00018468716, 0.00018187886, 0.00017913337, 0.0001767945, 0.00017444766, 0.00017188919, 0.00016952782, 0.00016730299, 0.00016499683, 0.00016290001, 0.00016089583, 0.0001587657, 0.00015662962, 0.00015466079, 0.0001525357, 0.00015044904, 0.00014833481, 0.00014602587, 0.00014348439, 0.0001412355, 0.00013927063, 0.00013732575, 0.00013536514, 0.00013331278, 0.00013127103, 0.00012920522, 0.00012725748, 0.00012537265, 0.00012348115, 0.00012161244, 0.00011968064, 0.00011775736, 0.00011587425, 0.00011402996, 0.00011222746, 0.00011047156, 0.00010869748, 0.00010694134, 0.00010521547, 0.00010350794, 0.00010184013, 0.00010019222, 9.8557534e-05, 9.6916422e-05, 9.5311094e-05, 9.3737256e-05, 9.2167319e-05, 9.0626551e-05, 8.9097008e-05, 8.7580795e-05, 8.6084446e-05, 8.4610097e-05, 8.3161151e-05, 8.1725966e-05, 8.0316477e-05, 7.892995e-05, 7.7528984e-05, 7.6151177e-05, 7.4799664e-05, 7.3461694e-05, 7.2146308e-05, 7.0841689e-05, 6.9558749e-05, 6.82868e-05, 6.7019597e-05, 6.5789212e-05, 6.4566799e-05, 6.3354135e-05, 6.216748e-05, 6.0995697e-05, 5.9826548e-05, 5.8656867e-05, 5.7517682e-05, 5.6391344e-05, 5.5275024e-05, 5.4191468e-05, 5.3104781e-05, 5.202328e-05, 5.097535e-05, 4.9930884e-05, 4.8906517e-05, 4.7901965e-05, 4.6887109e-05, 4.5878057e-05, 4.488247e-05, 4.3901135e-05, 4.2938161e-05, 4.1980499e-05, 4.1033143e-05, 4.0097034e-05, 3.916836e-05, 3.8263505e-05, 3.7376392e-05, 3.6508509e-05, 3.5654459e-05, 3.4799873e-05, 3.3958385e-05, 3.3132592e-05, 3.2315845e-05, 3.1518549e-05, 3.0730051e-05, 2.9946272e-05, 2.9178726e-05, 2.8422964e-05, 2.7681325e-05, 2.6953193e-05, 2.62361e-05, 2.5528081e-05, 2.4829963e-05, 2.4143857e-05, 2.3464886e-05, 2.2794801e-05, 2.2134406e-05, 2.1477402e-05, 2.0830966e-05, 2.019298e-05, 1.9562312e-05, 1.8944459e-05, 1.8332188e-05, 1.7728731e-05, 1.7137224e-05, 1.655181e-05, 1.5977265e-05, 1.5410854e-05, 1.4850332e-05, 1.4300358e-05, 1.3756461e-05, 1.3221478e-05, 1.2693428e-05, 1.2171671e-05, 1.1660745e-05, 1.115659e-05, 1.0660526e-05, 1.0173886e-05, 9.6936033e-06, 9.2226845e-06, 8.7595274e-06, 8.3036173e-06, 7.8561784e-06, 7.414669e-06, 6.9817113e-06, 6.5547767e-06, 6.1347073e-06, 5.7237002e-06, 5.3179345e-06, 4.9207513e-06, 4.5308335e-06, 4.1452405e-06, 3.7681377e-06, 3.3965984e-06, 3.0319377e-06, 2.6755198e-06, 2.322879e-06, 1.9769963e-06, 1.6361625e-06, 1.3011104e-06, 9.7374029e-07, 6.4954342e-07, 3.3154137e-07, 1.9555108e-08, -2.8850005e-07, -5.8860957e-07, -8.8453573e-07, -1.1758724e-06, -1.4609756e-06, -1.7420382e-06, -2.0155012e-06, -2.2851187e-06, -2.5506943e-06, -2.8093978e-06, -3.0646216e-06, -3.3135098e-06, -3.5566563e-06, -3.7963791e-06, -4.0294944e-06, -4.2588645e-06, -4.48314e-06, -4.7011579e-06, -4.9152947e-06, -5.1229738e-06, -5.3266195e-06, -5.5266958e-06, -5.7215527e-06, -5.9119823e-06, -6.097324e-06, -6.2789952e-06, -6.4566069e-06, -6.6295672e-06, -6.8005867e-06, -6.9661368e-06, -7.1275151e-06, -7.2866647e-06, -7.4406839e-06, -7.5927009e-06, -7.7408537e-06, -7.8845557e-06, -8.0264568e-06, -8.1632978e-06, -8.2977973e-06, -8.4301417e-06, -8.5568669e-06, -8.6824851e-06, -8.8041358e-06, -8.9217352e-06, -9.0381256e-06, -9.150212e-06, -9.2597435e-06, -9.3660792e-06, -9.4686523e-06, -9.5693644e-06, -9.6663171e-06, -9.7606456e-06, -9.852218e-06, -9.9398596e-06, -1.0025643e-05, -1.0107832e-05, -1.0188117e-05, -1.0265668e-05, -1.0339241e-05, -1.0411657e-05, -1.0480168e-05, -1.0546331e-05, -1.0611318e-05, -1.0671897e-05, -1.0731203e-05, -1.0787938e-05, -1.0840991e-05, -1.089383e-05, -1.0942747e-05, -1.098984e-05, -1.1035688e-05, -1.1077302e-05, -1.111831e-05, -1.1157191e-05, -1.1192876e-05, -1.122799e-05, -1.126004e-05, -1.1290234e-05, -1.1318981e-05, -1.1345133e-05, -1.1370284e-05, -1.139272e-05, -1.1413761e-05, -1.1433097e-05, -1.1450233e-05, -1.1466382e-05, -1.1479952e-05, -1.1492275e-05, -1.1503153e-05, -1.1511377e-05, -1.1519723e-05, -1.1525182e-05, -1.1528944e-05, -1.1532651e-05, -1.153272e-05, -1.1532863e-05, -1.153163e-05, -1.1527603e-05, -1.1528536e-05, -1.152206e-05, -1.1511412e-05, -1.1510731e-05, -1.1484279e-05, -1.1502042e-05, -1.1444652e-05, -1.1496561e-05, -1.1401e-05, -1.1300933e-05];

	return l_hrir_1;
}

// IRC_1147, COMPENSATED, 44.1 kHz
// right ear, navigation = [-30 , 0]
function getRightTestBuffer() {

	var r_hrir_1 = [0.00012968447, -4.4833788e-05, 8.5615178e-05, 5.2901694e-05, -6.6440116e-06, 0.00023888806, -2.8313273e-05, -4.2645389e-06, 0.00012126938, -2.1980022e-05, -2.1957093e-06, 0.00011809272, 2.6500596e-05, 7.0864197e-05, 0.00011691406, -0.00026727003, 0.00038585979, -0.00087029932, 0.0010163673, -0.0016523712, 0.0023054694, -0.0029419215, 0.02964541, 0.0060411226, -0.06344479, 0.027112967, -0.0080826665, -0.019840752, 0.11743281, 0.042333728, 0.034297803, 0.094531388, 0.037250009, -0.0037743261, -0.0094662558, 0.0074441826, -0.002948507, -0.036766379, -0.0034563663, 0.016807154, -0.014027366, 0.0035911231, 0.0018989791, 0.013578715, 0.014343985, 0.010805275, 0.0017550988, 0.0074502748, 0.0035782603, -0.006502539, 0.0055554395, -0.0051867008, -0.0077680597, -0.00063252901, -0.0098461853, -0.011175415, -0.0053015536, -0.0081243965, -0.012826758, -0.021176968, -0.020040944, -0.008780459, -0.007149576, -0.0023101265, -0.0079937236, -0.0048443179, -0.0068382159, -0.0078493971, -0.0023994799, -0.0061057738, -0.0073136081, -0.0023773567, -0.0059973386, -0.0054297321, -0.001735636, -0.0052404751, -0.00048804818, -0.0022025927, -0.00099874898, 0.0064416961, -0.013730736, -0.0047333692, 0.0062401785, -0.0058429281, 0.0010514925, -0.002056349, -0.0030489554, -0.011757925, -0.0052199476, -0.0095679235, 0.0071277114, -0.019357755, -0.022061019, -0.0017161931, -0.0093587057, -0.0079322517, 0.009942682, -0.01321086, -0.0052761264, 0.00072435802, -0.0027481885, -7.5230251e-05, -0.00022060311, -0.014667933, -0.0030626816, -0.0026752634, -0.012888399, -0.018657888, -0.011077874, -0.016408245, -0.0095450282, -0.0046633224, -0.0055801768, -0.0083926211, -0.0031749941, -0.0054011488, -0.0030097948, -0.0023267575, 7.9327681e-05, -0.0015963236, -0.00097387318, 6.2268467e-05, -0.00040731921, 0.00036794444, 0.0016603111, 0.00086353469, -0.0005586378, -0.0033754013, -0.0021049967, -0.00073923132, 0.0012426978, 0.00048173329, -0.0013443229, -0.0032725884, -0.0019374721, 0.00055878145, 0.00010709605, -0.0023751592, -0.0031964437, -0.003138411, -0.003779512, -0.0023188085, -0.0027534361, -0.0032227256, -0.0027060221, -0.0009767624, -0.00029449009, -0.0015156205, -0.0016212052, -0.00083772424, -0.00051142355, -0.00087454151, -0.00082778176, -0.00087696032, -0.0005240417, -0.0010908106, -0.00060439314, 0.00049582734, -0.00022234685, -0.001076809, -0.0011043286, 0.00010021065, 0.0003510776, 0.00054787386, -0.00015454513, -0.00027695372, 0.00059145676, -0.00092269794, 0.00038142433, 0.0026431155, 0.0017825192, -0.0016865821, 0.00040997076, 0.00031288566, 0.0011209374, -0.00056213687, -0.0021413163, -0.00048407112, 0.0015524018, 0.00099149104, -0.0015391124, 2.3607917e-05, 0.00063025081, 0.0020399874, 0.0011285819, -0.00023675074, -0.0013372991, 0.0011111901, 0.00058305655, -0.00095981433, -0.0024444119, -0.0022328691, -0.0020971316, -0.0020945863, -0.0012388034, -0.0005692108, -0.0014941334, -0.0013966204, 0.00038663071, -6.5744303e-05, -0.0002194957, 0.00036541771, -0.00078601483, -0.00069451153, 0.0003469499, 0.00075997592, 7.4945015e-05, 0.00098961018, 0.001622136, 0.0011897596, 0.0016066994, 0.0018443016, 0.0010589289, 0.00090713392, 0.00090913781, 0.00099631402, 0.00069363213, 0.0007172969, 0.00069799042, 0.00065530833, 0.00044603324, 0.00023525355, 0.00082289652, 0.00083974303, 0.00072033696, 0.0010272059, 0.000694426, 0.00061945878, 0.00072450046, 0.00067908585, 0.00087421185, 0.00067820348, 0.00061537406, 0.00056530067, 0.00060326247, 0.00061357627, 0.00058757944, 0.00066320578, 0.00066578856, 0.0006869487, 0.00073921523, 0.00079197216, 0.00084638441, 0.00096455355, 0.00096418034, 0.00095147682, 0.0010188184, 0.0010686564, 0.0011374242, 0.0011457252, 0.0012067451, 0.0012186938, 0.0012421307, 0.0012696035, 0.0012774542, 0.0012976373, 0.0013118302, 0.0012846557, 0.0012700042, 0.0012938418, 0.0012889062, 0.0013061971, 0.0013155606, 0.0013232455, 0.0013150025, 0.0013273987, 0.0013581082, 0.0013455696, 0.0013849935, 0.0014073932, 0.0013834305, 0.0013974272, 0.0014054978, 0.001392369, 0.0014238558, 0.0014348065, 0.0014331656, 0.0014592002, 0.001429469, 0.0014245059, 0.0014917667, 0.0014767126, 0.0014466019, 0.0014673353, 0.0014431901, 0.0014458889, 0.0014635539, 0.0014462352, 0.0014721369, 0.0014880508, 0.0014736709, 0.0014981523, 0.0015268875, 0.0015316907, 0.0015510023, 0.001574997, 0.0015802422, 0.0015923924, 0.0016238457, 0.0016247143, 0.0016264677, 0.0016500061, 0.0016575305, 0.001662676, 0.0016788868, 0.0016853736, 0.0016765222, 0.0016853522, 0.0016938253, 0.0016920553, 0.0016955402, 0.0016963586, 0.0016859962, 0.0016794113, 0.0016723978, 0.0016749097, 0.0016734549, 0.0016646565, 0.0016590366, 0.0016597643, 0.0016601148, 0.0016602048, 0.0016601534, 0.0016631011, 0.001663515, 0.0016633881, 0.0016665934, 0.001669197, 0.0016774124, 0.0016837142, 0.0016842757, 0.0016877638, 0.0016939821, 0.0016994184, 0.001704174, 0.0017107124, 0.0017185124, 0.0017214578, 0.0017231655, 0.0017248615, 0.0017275463, 0.0017321063, 0.0017319864, 0.001728176, 0.0017290723, 0.001726488, 0.001726774, 0.0017281492, 0.0017259034, 0.0017235558, 0.0017225531, 0.0017206711, 0.0017192281, 0.0017192947, 0.0017164425, 0.0017155723, 0.0017187522, 0.0017162077, 0.0017077174, 0.0017105726, 0.0017124353, 0.0017108461, 0.0017082778, 0.0017029993, 0.001701386, 0.0017012992, 0.0016966711, 0.001694226, 0.0016932734, 0.001689505, 0.0016867262, 0.001684639, 0.0016828094, 0.0016824862, 0.0016824416, 0.0016792258, 0.0016755921, 0.0016750747, 0.0016737919, 0.0016706676, 0.0016711408, 0.001671641, 0.001669541, 0.0016663534, 0.0016652009, 0.0016671451, 0.0016648808, 0.0016614346, 0.0016610357, 0.0016564142, 0.0016528732, 0.0016520689, 0.0016475924, 0.0016431885, 0.0016403089, 0.0016362902, 0.0016310136, 0.0016278932, 0.0016257612, 0.0016203349, 0.0016152911, 0.0016118715, 0.0016073313, 0.0016030659, 0.0015986747, 0.0015933165, 0.0015895632, 0.001584777, 0.0015796373, 0.0015765975, 0.0015718899, 0.0015669377, 0.0015633044, 0.0015585903, 0.001554603, 0.0015505579, 0.0015465482, 0.0015428877, 0.0015381819, 0.0015346206, 0.001530824, 0.0015269124, 0.0015239447, 0.0015195987, 0.0015159148, 0.0015124543, 0.0015083753, 0.0015050984, 0.0015010558, 0.0014971819, 0.001493347, 0.0014887044, 0.001484724, 0.0014803579, 0.0014760734, 0.0014717858, 0.0014666051, 0.0014623749, 0.0014575611, 0.0014525443, 0.0014484185, 0.0014431992, 0.0014385824, 0.0014340053, 0.0014286917, 0.0014243781, 0.0014194645, 0.0014146681, 0.0014103174, 0.0014051177, 0.0014007867, 0.0013960355, 0.0013911306, 0.0013871143, 0.0013820917, 0.0013777034, 0.0013732681, 0.0013682012, 0.0013641619, 0.0013593904, 0.0013547699, 0.0013505959, 0.0013456026, 0.0013413429, 0.0013367484, 0.0013320703, 0.0013279857, 0.0013232181, 0.0013190107, 0.001314463, 0.0013097356, 0.0013058519, 0.0013010446, 0.0012967476, 0.0012925999, 0.0012876908, 0.0012837795, 0.0012791685, 0.0012746597, 0.0012708011, 0.0012658884, 0.0012617699, 0.0012575065, 0.0012527556, 0.0012488655, 0.0012441726, 0.0012397652, 0.0012356095, 0.0012307267, 0.001226769, 0.0012220057, 0.0012176242, 0.001213742, 0.0012124143, 0.0012074452, 0.0011971156, 0.0011951736, 0.001189256, 0.0011852494, 0.0011937217, 0.0011946776, 0.001195935, 0.001202345, 0.001202101, 0.0011973804, 0.0011921972, 0.0011886733, 0.0011833686, 0.001175074, 0.0011707554, 0.001167823, 0.0011622943, 0.0011582985, 0.0011544876, 0.0011518865, 0.0011493143, 0.0011462351, 0.0011422655, 0.0011387751, 0.0011347149, 0.0011297663, 0.0011258477, 0.0011207866, 0.0011155495, 0.0011108386, 0.0011051477, 0.0010993477, 0.0010942124, 0.001088599, 0.0010823677, 0.0010752187, 0.0010683608, 0.0010626757, 0.0010574017, 0.0010524184, 0.0010469693, 0.0010418095, 0.0010363114, 0.001030947, 0.0010260291, 0.0010206907, 0.0010153807, 0.0010104217, 0.001005132, 0.0010000609, 0.0009951667, 0.00099010484, 0.00098554187, 0.00098062861, 0.00097624493, 0.00097210414, 0.00096603669, 0.00096123183, 0.00095712158, 0.00095211179, 0.00094763708, 0.000942872, 0.00093784114, 0.00093202446, 0.00092668947, 0.00092138784, 0.00091725714, 0.00091029231, 0.00090345699, 0.00089853564, 0.00089283046, 0.00088775093, 0.00088399884, 0.00087807413, 0.00087303247, 0.00086855006, 0.00086375685, 0.00085936393, 0.00085453323, 0.00084852814, 0.00084367115, 0.00083871297, 0.00083252788, 0.0008259946, 0.00081998583, 0.00081365626, 0.00080813276, 0.00080309055, 0.00079792392, 0.00079265161, 0.00078779632, 0.00078283065, 0.00077811576, 0.00077350782, 0.00076919383, 0.00076470019, 0.00076030412, 0.00075604884, 0.00075171767, 0.00074753595, 0.00074352061, 0.00073937133, 0.00073505314, 0.00073048249, 0.00072601349, 0.00072178833, 0.00071778192, 0.00071366474, 0.00070934348, 0.00070483403, 0.00070050811, 0.0006964801, 0.00069237485, 0.00068798633, 0.00068355492, 0.00067907319, 0.00067457917, 0.00067028375, 0.00066589849, 0.00066150117, 0.00065722842, 0.0006530973, 0.00064908157, 0.00064495545, 0.0006408145, 0.00063680572, 0.00063281742, 0.00062879181, 0.00062482539, 0.00062084226, 0.00061691144, 0.00061295354, 0.00060904914, 0.00060527795, 0.00060145801, 0.00059752487, 0.00059364015, 0.00058991089, 0.00058618791, 0.00058252286, 0.00057879214, 0.0005750773, 0.00057143506, 0.00056767413, 0.00056408052, 0.00056077747, 0.00055729632, 0.00055352011, 0.00054997564, 0.00054641851, 0.00054295684, 0.00053931331, 0.00053551895, 0.00053195492, 0.00052863606, 0.00052517081, 0.00052153565, 0.00051806077, 0.00051469329, 0.00051148616, 0.00050816332, 0.00050466961, 0.00050115617, 0.00049787153, 0.00049453044, 0.00049103215, 0.0004873464, 0.00048372139, 0.00048013208, 0.00047655406, 0.00047310396, 0.00046973281, 0.0004662385, 0.00046284334, 0.00045962747, 0.00045637374, 0.0004531491, 0.00044995436, 0.00044665298, 0.00044342175, 0.00044029465, 0.00043722386, 0.00043412649, 0.00043111871, 0.00042820065, 0.00042527698, 0.0004223964, 0.0004195497, 0.00041663902, 0.00041369662, 0.0004107952, 0.00040790928, 0.00040499581, 0.0004021129, 0.00039922476, 0.00039633879, 0.00039346665, 0.00039057125, 0.00038775961, 0.00038497593, 0.0003821672, 0.00037941674, 0.00037665518, 0.00037388251, 0.00037114418, 0.00036842017, 0.00036570402, 0.00036300561, 0.00036030492, 0.00035760887, 0.00035494213, 0.00035227235, 0.00034961568, 0.00034700292, 0.00034437986, 0.0003417836, 0.00033921813, 0.00033664253, 0.00033410688, 0.00033160594, 0.0003291026, 0.00032662405, 0.00032416444, 0.0003217087, 0.00031929489, 0.00031688918, 0.00031450056, 0.00031213764, 0.00030977467, 0.00030742997, 0.00030512027, 0.00030280236, 0.00030050895, 0.00029823527, 0.00029594522, 0.0002936886, 0.00029145057, 0.00028921501, 0.00028700329, 0.00028480171, 0.00028259936, 0.00028043082, 0.00027826905, 0.00027611871, 0.00027399472, 0.00027186925, 0.00026975794, 0.00026767713, 0.00026558941, 0.00026352268, 0.00026148016, 0.00025942513, 0.00025740035, 0.00025539348, 0.00025338586, 0.00025139981, 0.00024942823, 0.00024745722, 0.00024551216, 0.00024357175, 0.00024164119, 0.00023973128, 0.00023781952, 0.00023592309, 0.00023405476, 0.00023218314, 0.00023033034, 0.00022849847, 0.00022666017, 0.00022484975, 0.00022305538, 0.00022126774, 0.00021949982, 0.00021774036, 0.00021598884, 0.00021426317, 0.00021254069, 0.00021083331, 0.00020914501, 0.00020745475, 0.00020578273, 0.00020413285, 0.00020247995, 0.00020084592, 0.00019922805, 0.00019760386, 0.00019600417, 0.00019441597, 0.00019283158, 0.00019126355, 0.00018970019, 0.00018814285, 0.00018660839, 0.00018507457, 0.00018355261, 0.00018204726, 0.00018053906, 0.000179047, 0.00017757352, 0.00017609967, 0.00017464214, 0.0001731975, 0.00017174969, 0.00017032394, 0.00016890892, 0.00016750044, 0.00016610763, 0.00016471978, 0.00016333948, 0.00016198053, 0.0001606235, 0.0001592795, 0.00015795133, 0.00015662102, 0.00015530638, 0.00015400796, 0.00015271057, 0.00015142833, 0.00015015699, 0.00014888377, 0.00014762993, 0.00014638409, 0.00014514453, 0.00014391918, 0.0001426972, 0.00014148229, 0.00014028576, 0.00013908976, 0.00013790545, 0.00013673453, 0.00013556092, 0.00013440209, 0.00013325716, 0.00013211343, 0.00013098211, 0.00012986029, 0.00012873877, 0.00012763427, 0.00012653632, 0.00012544427, 0.00012436466, 0.00012328797, 0.00012221837, 0.00012116492, 0.00012011182, 0.00011906946, 0.00011803888, 0.00011700592, 0.00011598665, 0.00011497902, 0.00011397367, 0.00011297976, 0.00011199329, 0.00011100798, 0.00011003781, 0.00010907316, 0.00010811505, 0.00010716834, 0.00010622381, 0.0001052866, 0.00010436392, 0.00010344163, 0.00010252967, 0.00010162818, 0.00010072465, 9.9833587e-05, 9.8952038e-05, 9.8073177e-05, 9.720437e-05, 9.6341608e-05, 9.5480631e-05, 9.4632666e-05, 9.3788986e-05, 9.2951352e-05, 9.2123497e-05, 9.1297042e-05, 9.0477523e-05, 8.9670463e-05, 8.8862948e-05, 8.8064769e-05, 8.7275711e-05, 8.6484342e-05, 8.5704505e-05, 8.4932515e-05, 8.4163072e-05, 8.3402678e-05, 8.2647239e-05, 8.1893933e-05, 8.1152152e-05, 8.0413887e-05, 7.9681333e-05, 7.8957317e-05, 7.823448e-05, 7.7518487e-05, 7.6812958e-05, 7.6107688e-05, 7.541077e-05, 7.4721987e-05, 7.4031368e-05, 7.33513e-05, 7.2677937e-05, 7.2007493e-05, 7.1344966e-05, 7.0686699e-05, 7.0031075e-05, 6.9385528e-05, 6.8742952e-05, 6.8105745e-05, 6.7476069e-05, 6.6847278e-05, 6.6224915e-05, 6.5611424e-05, 6.4998486e-05, 6.4392835e-05, 6.3793885e-05, 6.3193822e-05, 6.2602985e-05, 6.2017607e-05, 6.1435065e-05, 6.0859425e-05, 6.0287094e-05, 5.9717572e-05, 5.9156751e-05, 5.8598236e-05, 5.8044791e-05, 5.7497848e-05, 5.6951554e-05, 5.641125e-05, 5.587837e-05, 5.5346481e-05, 5.4820933e-05, 5.4301001e-05, 5.3780738e-05, 5.3268445e-05, 5.2760811e-05, 5.2256002e-05, 5.1776413e-05, 5.1280016e-05, 5.0775267e-05, 5.031772e-05, 4.9771142e-05, 4.9407774e-05, 4.8752217e-05, 4.8548765e-05, 4.7756157e-05, 4.6932342e-05];

	return r_hrir_1;
}

//==============================================================================
/**
 * Returns the name of the database for a given IRCAM subject
 * @param {int} subjectNumber
 */
function getDatabaseFromSubjectId(subjectNumber) {

	if (1002 <= subjectNumber && subjectNumber <= 1059) {
		return "LISTEN";
	} else if (1062 <= subjectNumber && subjectNumber <= 1089) {
		return "CROSSMOD";
	} else if (1100 <= subjectNumber && subjectNumber <= 1157) {
		return "BILI";
	} else {
		throw new Error("Not a valid IRCAM human subject id " + subjectNumber);
	}
}

//==============================================================================
/**
 * Returns an audio buffer containing left/right HRIR
 * @param {int} subjectNumber
 * @param {float} samplerate
 * @param {float} azimuth : expressed with navigational (Spat4) convention
 * @param {float} elevation : expressed with navigational (Spat4) convention
 */
function getHrir(subjectNumber, samplerate, azimuth, elevation) {

	var subjectAsString = subjectNumber.toString();

	var positionsType = 'sofaSpherical';

	/// position expressed with Spat navigation system
	/// distance is not relevant; just use 1 meter
	var navigation = [azimuth, elevation, 1];

	/// convert Spat navigation to Sofa coordinates (spherical)
	var sofaCoordinates = [-1 * azimuth, elevation, 1];

	/// create an offline audio context
	var audioContext = new OfflineAudioContext(1, 512, samplerate);

	var hrtfSet = new _binaural2.default.sofa.HrtfSet({
		audioContext: audioContext,
		filterPositions: [sofaCoordinates],
		positionsType: positionsType
	});

	var serverDataBase = new _binaural2.default.sofa.ServerDataBase();

	return serverDataBase.loadCatalogue().then(function () {

		var urls = serverDataBase.getUrls({
			convention: 'HRIR',
			dataBase: 'BILI',
			equalisation: 'COMPENSATED',
			sampleRate: samplerate,
			freePattern: subjectAsString
		});

		return urls;
	}).then(function (urls) {

		if (urls.length <= 0) {
			throw new Error("no url");
		}

		return hrtfSet.load(urls[0]);
	}).then(function () {

		return hrtfSet.nearestFir(sofaCoordinates);
	});
}

//==============================================================================
function testHrtfFromSofaServer() {

	getHrir(1147, 44100, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var leftExpected = getLeftTestBuffer();
		var rightExpected = getRightTestBuffer();

		var tolerance = 1e-6;

		var leftAreEqual = _utils2.default.arrayAlmostEqual(leftHrir, leftExpected, tolerance);
		if (leftAreEqual === false) {
			new Error("test failed");
		}

		var rightAreEqual = _utils2.default.arrayAlmostEqual(rightHrir, rightExpected, tolerance);
		if (rightAreEqual === false) {
			new Error("test failed");
		}

		debugger;
	});
}

//==============================================================================
var sofatests = {
	getHrir: getHrir,
	testHrtfFromSofaServer: testHrtfFromSofaServer
};

exports.default = sofatests;