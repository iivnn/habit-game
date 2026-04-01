import type { CharacterClassId } from "@/domain/types";

export interface ClassSpriteDefinition {
  matrix: string[];
  palette: Record<string, string>;
}

const basePalette = {
  ".": "transparent",
  x: "#281720",
  h: "#f4c6a1",
  n: "#dc9f7b",
  e: "#4e2c2c",
  m: "#96a4b3",
  s: "#dfe8f1",
  b: "#6d4631",
  d: "#5f6b79",
  g: "#f0d26f",
  w: "#fff8e5"
};

export const classSprites: Record<CharacterClassId, ClassSpriteDefinition> = {
  warrior: {
    matrix: [
      "........xxxx........",
      "......xxmmmmxx......",
      ".....xmmssssmmx.....",
      ".....xmmddddsmx.....",
      "....xmshhhhhsmmx....",
      "....xmshennhsmmx....",
      "....xmshhhhhsmmx....",
      "...xxmmshhhsmrxx....",
      "...xrrrmmmmrrrxx....",
      "..xxrrrooorrrrxx....",
      "..xrrrmmmmmmrrrx....",
      "..xrrmmggggmmrrx....",
      ".xxrrmmmddmmmrrxx...",
      ".xrrrmmddddmmrrrx...",
      ".xbrxxmxxxxmxxrbx...",
      ".xbbxx......xxbbx...",
      "xxbbx........xbbxx..",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      r: "#8b5a40"
    }
  },
  archer: {
    matrix: [
      "........xxxx........",
      "......xxaaaaxx......",
      ".....xaaammmssx.....",
      ".....xaamdddssx.....",
      "....xasmhhhhhsmx....",
      "....xasmhennhsmx..b.",
      "....xasmhhhhhsmx.bb.",
      "...xxaasmhhhsaaxxbb.",
      "...xaaarmmmmaaaxxbb.",
      "..xxaaaoooomaaaxxbb.",
      "..xaammmmmmmaaaxxbb.",
      "..xaammggggmaaaxxbb.",
      ".xxaaammmmmmaaaxx.bb",
      ".xaaaammddmmaaax..bb",
      ".xbaxxmxxxxmxxab..bb",
      ".xbbxx......xxbb..bb",
      "xxbbx........xbbxxb.",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      a: "#6b8f3f",
      o: "#ee922f"
    }
  },
  mage: {
    matrix: [
      ".........pp.........",
      ".......xxppxx.......",
      "......xppmmmxx......",
      ".....xpmmdddppx.....",
      "....xpmmhhhhhmx.....",
      "....xpmmhennhmx..o..",
      "....xpmmhhhhhmx.oo..",
      "...xxppsmhhhspxxo...",
      "...xpppmmmmpppxxo...",
      "..xxpppoooopppxxo...",
      "..xpppmmmmmmpppx....",
      "..xppmmggggmmppx....",
      ".xxpppmmmmmmpppx....",
      ".xpppmmmddmmmppx....",
      ".xbpxxmxxxxmxxpb....",
      ".xbbxx......xxbb....",
      "xxbbx........xbbxx..",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      p: "#5666c8",
      o: "#86ddff"
    }
  },
  rogue: {
    matrix: [
      "........vvvv........",
      "......xxvvvvxx......",
      ".....xvvvmmmvvx.....",
      ".....xvvmdddvvx.....",
      "....xvvshhhhsvvx....",
      "....xvvshennhvvx....",
      "....xvvshhhhsvvx....",
      "...xxvvvshhsvvxx....",
      "...xvvvmmmmvvvxx....",
      "..xxvvvoooovvvxx....",
      "..xvvvmmmmmmvvvx....",
      "..xvvmmggggmmvvx....",
      ".xxvvvmmmmmmvvvxx...",
      ".xvvvmmmddmmmvvx....",
      ".xbvxxmxxxxmxxvb....",
      ".xbbxx......xxbb....",
      "xxbbx......o.xbbxx..",
      "xbbbx.....oo.xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      v: "#4d505c",
      o: "#d1a062"
    }
  },
  cleric: {
    matrix: [
      ".........ww.........",
      ".........gw.........",
      "......xxccmmxx......",
      ".....xcccmdddcc.....",
      "....xccsmhhhhsmx....",
      "....xccsmhennsmx.g..",
      "....xccsmhhhhsmx.g..",
      "...xxccsmhhhsmxxg...",
      "...xcccmmmmcccxxg...",
      "..xxcccoooocccxxg...",
      "..xcccmmmmmmcccxg...",
      "..xccmmggggmmccxg...",
      ".xxcccmmmmmmcccxx...",
      ".xcccmmmddmmmcccx...",
      ".xbcxxmxxxxmxxcbx...",
      ".xbbxx......xxbbx...",
      "xxbbx........xbbxx..",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      c: "#ddd7c7",
      o: "#f0d56e"
    }
  },
  sorcerer: {
    matrix: [
      ".........uu.........",
      ".......xxuuxx.......",
      "......xuummmxx......",
      ".....xuummdduux.....",
      "....xuummhhhhmx.....",
      "....xuummhennmx..o..",
      "....xuummhhhhmx.oo..",
      "...xxuusmhhhsmxxo...",
      "...xuuummmmuuuxxo...",
      "..xxuuuoooouuuxxo...",
      "..xuuummmmmmuuux....",
      "..xuummggggmmuux....",
      ".xxuuummmmmmuuux....",
      ".xuuummmddmmmuux....",
      ".xbuxxmxxxxmxxub....",
      ".xbbxx......xxbb....",
      "xxbbx........xbbxx..",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      u: "#7c49c7",
      o: "#f08cdd"
    }
  },
  knight: {
    matrix: [
      "........xxxx........",
      "......xxqqqqxx......",
      ".....xqqmssmqqx.....",
      ".....xqqmdddqqx.....",
      "....xqqshhhhsmqx....",
      "....xqqshennhmqx....",
      "....xqqshhhhsmqx....",
      "...xxqqmshhhmqqxx...",
      "...xqqqmmmmqqqxx....",
      "..xxqqqoooqqqqxx....",
      "..xqqqmmmmmmqqqx....",
      "..xqqmmggggmmqqx....",
      ".xxqqqmmmmmmqqqxx...",
      ".xqqqmmmddmmmqqx....",
      ".xbqxxmxxxxmxxqb....",
      ".xbbxx......xxbb....",
      "xxbbx........xbbxx..",
      "xbbbx........xbbbx..",
      "xbbx..........xbbx..",
      "xxxx..........xxxx.."
    ],
    palette: {
      ...basePalette,
      q: "#8fa0b1",
      o: "#efde98"
    }
  }
};
