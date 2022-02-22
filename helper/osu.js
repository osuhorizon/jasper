module.exports = {
    mods : async function(mods){
        const hidden = (mods & 8) != 0
        const flashlight = (mods & 1024) != 0
        const silver = hidden || flashlight

        var modsString = ["NF", "EZ", "NV", "HD", "HR", "SD", "DT", "RX", "HT", "NC", "FL", "AU", "SO", "AP", "PF", "K4", "K5", "K6", "K7", "K8", "K9", "RN", "LM", "K9", "K0", "K1", "K3", "K2"];
        
        async function getScoreMods(e, t) {
            var n = [];
            return 512 == (512 & e) && (e &= -65), 16384 == (16384 & e) && (e &= -33), modsString.forEach(function(t, i) {
                var o = 1 << i;
            (e & o) > 0 && n.push(t)
            }), n.length > 0 ? (t ? " " : " + ") + n.join(", ") : t ? "None" : ""
        }

        const mod = await getScoreMods(mods)

        return {
            "string" : mod,
            "silver" : silver
        }

    },
    rank : async function(mode, mods, acc, c300, c100, c50, miss){
        const total = c300 + c100 + c50 + miss;

        switch(mode){
            case 0:
            case 1:
                const percent = c300 / total
                if(acc == 100) return mods.silver ? "SSH" : "SS"
                if(percent > 0.90 && c50 / total < 0.1 && miss == 0) return mods.silver ? 'SH' : 'S'
                if(percent > 0.80 && miss == 0 || percent > 0.90) return 'A'
                if(percent > 0.70 && miss == 0 || percent > 0.80) return 'B'
                if(percent > 0.60 && miss == 0 || percent > 0.70) return 'C'
                return 'D'
            case 2:
                if(acc == 100) return mods.silver ? "SSH" : "SS"
                if(acc >= 98.01 && acc <= 99.99) return mods.silver ? 'SH' : 'S'
                if(acc >= 94.01 && acc <= 98.00) return 'A'
                if(acc >= 90.01 && acc <= 94.00) return 'B'
                if(acc >= 85.01 && acc <= 90.00) return 'C'
                return 'D'
            case 3:
                if(acc == 100) return mods.silver ? "SSH" : "SS"
                if(acc > 95) return mods.silver ? 'SH' : 'S'
                if(acc > 90) return 'A'
                if(acc > 85) return 'B'
                if(acc > 80) return 'C'
                return 'D'
        }
    }
}