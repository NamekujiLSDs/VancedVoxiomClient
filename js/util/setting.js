const store = require('electron-store');
const log = require('electron-log');

const config = new store()

log.info('Setting.js has been loaded.')

module.exports = {
    customBackGround: {
        cat: 'Menu',
        id: 'customBG',
        title: 'Custom background image',
        type: 'text',
        val: config.get('customBG'),
        restart: false,
        default: 'https://namekujilsds.github.io/VVC/vvc-bg.png'
    },
    customGameLogo: {
        cat: 'Menu',
        id: 'customLogo',
        title: 'Custom game logo image',
        type: 'text',
        val: config.get('customLogo'),
        restart: false,
        default: 'https://namekujilsds.github.io/VVC/vvc-logo.png'
    },
    customGameLogoText: {
        cat: 'Menu',
        id: 'customGameLogoText',
        title: 'Custom logo text',
        type: 'text',
        val: config.get('customGameLogoText'),
        restart: false,
        default: 'Vanced Voxiom Client for Noobs.'
    },
    customCrosshairCheck: {
        cat: 'Crosshair',
        id: 'customCrosshairCheckbox',
        title: 'Use custom crosshair',
        type: 'checkbox',
        val: config.get('customCrosshairCheckbox'),
        restart: false,
        default: true,
    },
    customCrosshairImage: {
        cat: 'Crosshair',
        id: 'customCrosshairImage',
        title: 'Custom crosshair URL',
        type: 'text',
        val: config.get('customCrosshairImage'),
        restart: false,
        default: 'https://namekujilsds.github.io/VVC/vvc-crosshair.png'
    },
    crosshairSizeX: {
        cat: 'Crosshair',
        id: 'crosshairSizeX',
        title: 'crosshair Size X',
        type: 'range-text',
        val: config.get('crosshairSizeX'),
        restart: false,
        default: '22',
    },
    crosshairSizeY: {
        cat: 'Crosshair',
        id: 'crosshairSizeY',
        title: 'crosshair Size Y',
        type: 'range-text',
        val: config.get('crosshairSizeY'),
        restart: false,
        default: '22',
    },
    detectCrosshairSize: {
        cat: 'Crosshair',
        id: 'detectCrosshairSize',
        title: 'Auto crosshair sizing',
        type: 'button',
        buttonVal: 'Size set',
        val: config.get('detectCrosshairSize'),
        restart: false,
        val: 'Detect',
    },
    cssType: {
        cat: 'CSS',
        id: 'cssType',
        title: 'Custom CSS type',
        type: 'select',
        val: config.get('cssType'),
        options: {
            none: 'Disable',
            text: 'Textarea',
            localfile: 'Local File',
            online: 'From URL'
        },
        restart: true,
        default: 'none'
    },
    cssTextarea: {
        cat: 'CSS',
        id: 'cssTextarea',
        title: 'CSS Textarea',
        type: 'textarea',
        val: config.get('cssTextarea'),
        restart: false,
    },
    cssLocal: {
        cat: 'CSS',
        id: 'cssLocal',
        title: 'Local CSS',
        type: 'openFile',
        val: config.get('cssLocal'),
        restart: false,
    },
    cssUrl: {
        cat: 'CSS',
        id: 'cssUrl',
        title: 'CSS url',
        type: 'text',
        val: config.get('cssUrl'),
        restart: false,
    },
    quickJoinRegion: {
        cat: 'QuickJoin',
        id: 'quickJoinRegion',
        title: 'Region',
        type: 'select',
        val: config.get('quickJoinRegion'),
        options: {
            0: 'US West',
            1: 'US East ',
            2: 'Europe',
            3: 'Asia',
        },
        restart: false,
        default: '0'
    },
    quickJoinMode: {
        cat: 'QuickJoin',
        id: 'quickJoinMode',
        title: 'Gamemode',
        type: 'select',
        val: config.get('quickJoinMode'),
        options: {
            ffa: 'Free for All',
            ctg: 'Capture the Gem',
            svv: 'Survival',
            br: 'Battle Royale',
        },
        restart: false,
        default: 'ffa'
    },
    enableChatToWebhook: {
        cat: 'Mini Tool',
        id: 'enableCtW',
        title: 'Enable chat to webhook',
        type: 'checkbox',
        val: config.get('enableCtW'),
        restart: true,
        default: false,
    },
    webhookUrl: {
        cat: 'Mini Tool',
        id: 'webhookUrl',
        title: 'Webhook URL',
        type: 'password',
        val: config.get('webhookUrl'),
        restart: false,
    },
    resourceSwapperEnable: {
        cat: 'Mini Tool',
        id: 'resourceSwapperEnable',
        title: 'Enable Resource Swapper',
        type: 'checkbox',
        val: config.get('resourceSwapperEnable'),
        restart: true,
        default: false,
    },
    smartInfo: {
        cat: 'Mini Tool',
        id: 'smartInfo',
        title: "Enable smart info",
        type: 'checkbox',
        val: config.get('smartInfo'),
        restart: false,
        default: true,
    },
    angleBackend:{
        cat:'Advanced Setting',
        id:'angleType',
        title :'ANGLE graphics backend',
        type:'select',
        val:config.get('angleType'),
        options:{
            default:'default',
            openGl:'OpenGL',
            D3D9:'D3D9',
            D3D11:'D3D11',
            D3D11onD12:'D3D11onD12'
        },
        default: 'default'
    },
    unlimitedFps:{
        cat:'Advanced Setting',
        id:'unlimitedFPS',
        title:'Unlimited FPS',
        type: 'checkbox',
        val:config.get('unlimitedFPS'),
        default:true
    },
    webgl2Context:{
        cat:'Advanced Setting',
        id:'webgl2Context',
        title:'Enable WebGL2 Context',
        type: 'checkbox',
        val:config.get('webgl2Context'),
        default:true
    },
    inProcessGpu:{
        cat:'Advanced Setting',
        id:'inProcessGpu',
        title :'In-process-gpu',
        type:'checkbox',
        val:config.get('inProcessGpu'),
        default:true
    },
    acceleratedCanvas:{
        cat:'Advanced Setting',
        id:'acceleratedCanvas',
        title:'Enable Accelerated Canvas',
        type:'checkbox',
        val:config.get('acceleratedCanvas'),
        default:true
    }
}