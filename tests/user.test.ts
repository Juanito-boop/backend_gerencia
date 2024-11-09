import { afterAll, describe, expect, it, jest } from "@jest/globals";

import { closePool, pool } from "../src/config/connection/conexion";
import UsuarioDAO from "../src/dao/usuarioDAO";
import { Rol as roles, Token, User } from "../src/interface/interfaces";
import Jwt from "jsonwebtoken";
import Result from "../src/utils/Result";

import tokenDAO from "../src/dao/tokenDAO";
type Rol = "usuario" | "administrador" | "proveedor" | "establecimiento";

describe("UsuarioDAO", () => {
	describe("obtener la data de los usuarios mediante el username (columna indice)", () => {		
		const usernames = [ 
			"lrohmer9"       , "dbartczakb"     , "aolivec"      , "cgoeffe"       , "dbalaizotd"   , "ctremolieresf", "alangelaang", "bramsbothamh" , "pdredgei"     , "vstorchj"     ,
			"wdennerleyk"    , "wlambrick8"     , "hakid5"       , "tjestico0"     , "htuckera"     , "jsargerson4"  , "bgarfirth7" , "mhuchot3"     , "hogavin6"     , "gliggonsl"    ,
			"gocodihie2"     , "raylwinn"       , "cpickenm"     , "dbabono"       , "dbremenp"     , "hborsayq"     , "smartinetr" , "mlampertt"    , "ghuggans"     , "lclokeu"      ,
			"nkermeenv"      , "htrimew"        , "eballintynex" , "sshankliny"    , "bevequez"     , "bhallas11"    , "ycrowdson10", "jjoslow12"    , "vcocozza13"   , "vgumn14"      ,
			"rcrauford15"    , "miscowitz16"    , "jimesson17"   , "vjewar18"      , "astanlack19"  , "jmollene1b"   , "xkirvin1a"  , "dgudgeon1c"   , "jboodell1d"   , "lmeany1e"     ,
			"rbeaten1g"      , "atattersfield1k", "rchadburn1l"  , "beathorne1m"   , "mdowney1n"    , "sstapells1o"  , "aschistl1q" , "ygregersen1p" , "qcoggon1r"    , "dgullivent1s" ,
			"tgrice1t"       , "ecantillion1v"  , "bgherardini1x", "nangel1y"      , "clarman20"    , "ckleynen1z"   , "gpetrik21"  , "dlancashire22", "arandleson23" , "mbeeken26"    ,
			"porgee29"       , "bgaskoin2a"     , "astrathearn2b", "cthomsen2c"    , "cclutterham2d", "ktwelves2e"   , "laronoff2f" , "rstoakes2g"   , "ldowns2h"     , "cjewess2i"    ,
			"afahrenbacher2k", "gcozzi2j"       , "foxley2l"     , "fambrogiotti2n", "bbenwell2m"   , "gsiderfin2o"  , "vjanacek2p" , "adudenie2r"   , "cpeterson2q"  , "zecclestone1f",
			"cpampling1h"    , "ckaasmann1i"    , "wboules1j"    , "cmatityahu1u"  , "ltumioto1w"   , "acoveney24"   , "cpiggot25"  , "cmcgarva27"   , "arosencwaig28", "tabrashkin1"  ,
		];

		const mockUserData: Omit<User, "password"> = {
			user_id: "996877e8-b436-41a8-b2fc-4c2e1838fa60",
			nombre: "Hélèna",
			apellido: "Abrashkin",
			email: "labrashkin1@alibaba.com",
			username: "tabrashkin1",
			rol: roles.Establecimiento,
			created_at: new Date("2024-10-28T07:55:18.765Z"),
			updated_at: new Date("2024-11-01T05:36:56.786Z"),
		};

		usernames.forEach((username) => {
			it(`debería devolver un usuario existente con username: ${username}, o un error`, async () => {
				if (username === mockUserData.username) {
					const mockResult = { rows: [mockUserData] };
					jest.spyOn(pool, "one").mockResolvedValue(mockResult);

					const result = await UsuarioDAO.getUser(username);
					expect(result).toEqual(Result.success({ rows: expect.arrayContaining([expect.objectContaining(mockUserData)]) }));
				} else {
					jest.spyOn(pool, "one").mockRejectedValue(new Error("Usuario no encontrado"));

					const result = await UsuarioDAO.getUser(username);
					expect(result).toEqual(
						Result.fail(`No se puede obtener los usuarios, Error: Usuario no encontrado`)
					);
				}
			});
		});
	});

	afterAll(() => {
		closePool; 
	});
});

describe("TokenDAO", () => {
	describe("generar los token (JWT) de los usuarios mediante el username y la password", () => {
		const tokens: Token[] = [
			{ username: "tjestico0"       , password: "aW2)7h2&"          }, { username: "tabrashkin1"     , password: "yG3Qu9oqyBa"       },
			{ username: "gocodihie2"      , password: "cV1s(ns6"          }, { username: "mhuchot3"        , password: "wJ5)6l@k"          },
			{ username: "jsargerson4"     , password: "bG7e}yw.xD"        }, { username: "hakid5"          , password: "fA3!!bWzZRN$"      },
			{ username: "hogavin6"        , password: "dH2VA$wlQ+y$il$4"  }, { username: "bgarfirth7"      , password: "rO5ra<C+nXaM"      },
			{ username: "lrohmer9"        , password: "xQ4?r5GDn@k"       }, { username: "htuckera"        , password: "cG72lGUSO"         },
			{ username: "aolivec"         , password: "wV94aSE`9VRe"      }, { username: "dbalaizotd"      , password: "oV9meElIW6Nmb~"    },
			{ username: "ctremolieresf"   ,	password: "nA7wPM`vT"         }, { username: "alangelaang"     , password: "cR9laDf7U@guP"     },
			{ username: "bramsbothamh"    , password: "xM5zm%''xP"        }, { username: "pdredgei"        , password: "dS5_CcjlX8#*qtN@"  },
			{ username: "gliggonsl"       , password: "cC4#gE9zx"         }, { username: "cpickenm"        , password: 'hD6ahw>rHr3w"<.l'  },
			{ username: "dbabono"         , password: "oS4UC.b8r$"        }, { username: "dbremenp"        , password: "lX14l|Ti8td@lP"    },
			{ username: "smartinetr"      , password: "wZ0tZ8Ig}`"        }, { username: "ghuggans"        , password: "tZ1>(*MwR"         },
			{ username: "lclokeu"         , password: "mG2|lfTF'"         }, { username: "nkermeenv"       , password: "lQ89toU@fKF"       },
			{ username: "eballintynex"    , password: "xY5,l_<x3k$$"      }, { username: "sshankliny"      , password: "lI5<V&h(hS"        },
			{ username: "ycrowdson10"     , password: "kF5>W$9'E7"        }, { username: "bhallas11"       , password: "pF1wprS8S@y*~Fu_"  },
			{ username: "vcocozza13"      , password: "mD3B{<q*4?!%"      }, { username: "vgumn14"         , password: "yM2n3erkv+%2"      },
			{ username: "miscowitz16"     , password: "cH96KBc5"          }, { username: "jimesson17"      , password: "iL3aGL$VahagK"     },
			{ username: "astanlack19"     , password: "mP0.P86VfFnm"      }, { username: "xkirvin1a"       , password: "qF3w?(Si<s`vu"     },
			{ username: "dgudgeon1c"      , password: "zK6\\~MWWBaq'"     }, { username: "jboodell1d"      , password: 'pA9CY*"c&!u}b?'    },
			{ username: "zecclestone1f"   , password: "yA9rrF&Jvie"       }, { username: "rbeaten1g"       , password: "qR1b>'5KYc\\1OF"   },
			{ username: "ckaasmann1i"     , password: "xN2BJ`xE<N"        }, { username: "wboules1j"       , password: "lH6q)L.e2h=("      },
			{ username: "rchadburn1l"     , password: "xC9=i0}{'v)y@\"?"  }, { username: "beathorne1m"     , password: "vX4NLd11)6A4HCLL"  },
			{ username: "sstapells1o"     , password: 'fH1&7e"30cRv5Y'    }, { username: "ygregersen1p"    , password: "oP0xqKttlVf?)C"    },
			{ username: "qcoggon1r"       , password: "eZ2_cS@6m6~K5"     }, { username: "dgullivent1s"    , password: "hD2#s\\,iHJS%gtGY" },
			{ username: "cmatityahu1u"    , password: "dY5tQm$,m3uDa"     }, { username: "ecantillion1v"   , password: 'dD8Reb"1ny{~xL@'   },
			{ username: "bgherardini1x"   , password: 'aM0l#"Qh_m4r'      }, { username: "nangel1y"        , password: "fO61567*"          },
			{ username: "clarman20"       , password: "xU3cnV~%</Hu"      }, { username: "gpetrik21"       , password: "hG70J<UaF3xj?V%"   },
			{ username: "arandleson23"    , password: "zM9d\\Ej@T=s2|*M"  }, { username: "acoveney24"      , password: 'dO5\\3`1oL"CDY.'   },
			{ username: "mbeeken26"       , password: "lT1H!r2f'QRaT"     }, { username: "cmcgarva27"      , password: "qN6'3,HD"          },
			{ username: "porgee29"        , password: "eV6\\6LXq1&N|f@(e" }, { username: "bgaskoin2a"      , password: 'tT2dIl(",>26Rks'   },
			{ username: "cthomsen2c"      , password: "kV6MAH+E"          }, { username: "cclutterham2d"   , password: "dB1ZRBQOZ}pPt"     },
			{ username: "rstoakes2g"      , password: "uS3%r_<cYe5O@"     }, { username: "ldowns2h"        , password: "fW9Eh~bLKlqQ0g0z"  },
			{ username: "gcozzi2j"        , password: "yF1985Jw"          }, { username: "afahrenbacher2k" , password: "pM03Fg4ZJP"        },
			{ username: "bbenwell2m"      , password: "gG6_BY?*/#1`GM"    }, { username: "fambrogiotti2n"  , password: "sF2Q>+nB)@3DCH"    },
			{ username: "vjanacek2p"      , password: "qT0JCsP2"          }, { username: "cpeterson2q"     , password: "kS0fC<Dxi>4"       },
			{ username: "wlambrick8"      , password: "tZ74m$oUjuO_'d&"   }, { username: "dbartczakb"      , password: 'fU6D"@{#RV40UgAL'  },
			{ username: "cgoeffe"         , password: "pH7v@Bsu"          }, { username: "vstorchj"        , password: "nS0o?uk64"         },
			{ username: "wdennerleyk"     , password: "sI4q|D1mjM4\\"     }, { username: "raylwinn"        , password: "wO6m_$}.~bw\\kC"   },
			{ username: "hborsayq"        , password: "bO7$.@Gcr{Z!}q"    }, { username: "mlampertt"       , password: "mS0(~S#VNHozZ1d"   },
			{ username: "htrimew"         , password: "oC2D8}~r8yumj$"    }, { username: "bevequez"        , password: "sL6*rud2T9)A(4"    },
			{ username: "jjoslow12"       , password: "aF8pCW`&~%RjF"     }, { username: "rcrauford15"     , password: "lV1&3#7f,uX+0~="   },
			{ username: "vjewar18"        , password: "zP3GBOJB9A%"       }, { username: "jmollene1b"      , password: "dH7>?Qd4AGIf,*O%"  },
			{ username: "lmeany1e"        , password: "eG0nmfx3h2uWC~+"   }, { username: "cpampling1h"     , password: "xC2V#{1\\F!'O"     },
			{ username: "atattersfield1k" , password: "dM3KZ0+2G"         }, { username: "mdowney1n"       , password: "nI07t(J<UhYl,i"    },
			{ username: "aschistl1q"      , password: "zR3YM}=<"          }, { username: "tgrice1t"        , password: "uF7yxj(}}k"        },
			{ username: "ltumioto1w"      , password: "aM8)sW*GpIh'yZ3"   }, { username: "ckleynen1z"      , password: 'lP8mhTX@n8Z"'      },
			{ username: "dlancashire22"   , password: "fL0_$xI7niWCH'"    }, { username: "cpiggot25"       , password: "rB7wGJ~BR\\KZjaNI" },
			{ username: "arosencwaig28"   , password: "eN2fD)mY8J6Kqx"    }, { username: "astrathearn2b"   , password: "qO2gN3XN"          },
			{ username: "ktwelves2e"      , password: "aD7P+@?V%GuE|<q"   }, { username: "cjewess2i"       , password: "vC6=~#?EU"         },
			{ username: "foxley2l"        , password: "kB7l{._Y.@|'.&"    }, { username: "gsiderfin2o"     , password: 'eL5Z8"D}@9{r"'     },
			{ username: "adudenie2r"      , password: "lA9tJW=Wa`F+\\9j"  }, { username: "laronoff2f"      , password: "vJ31Lj1.ef"        },
		];

		tokens.forEach((tokenData) => {
			it(`debería devolver un error si no se encuentran registros para el usuario: ${tokenData.username}`, async () => {
				const mockResult = { rows: [] };
				jest.spyOn(pool, "result").mockResolvedValue(mockResult);
				const result = await tokenDAO.generateToken([tokenData]);

				expect(result).toEqual(Result.fail(`No se encontraron registros`));
			});

			it(`debería generar un token válido para el usuario: ${tokenData.username}`, async () => {
				const mockResult = {
					rows: [{ username: tokenData.username, rol: "usuario" as Rol }],
				};
				jest.spyOn(pool, "result").mockResolvedValue(mockResult);
				const result = await tokenDAO.generateToken([tokenData]);

				expect(result.isSuccess).toBe(true);

				const token = result.getValue();
				expect(token).toBeDefined();

				const secretKey = (process.env.JWT_SECRET_KEY || "LaSuperClave") as string;
				const decodedToken = Jwt.verify(token, secretKey);
				if (typeof decodedToken !== "string") {
					const propertiesToCheck = [
						{ key: "username", expected: tokenData.username },
						{ key: "rol", expected: "usuario" as Rol},
						{ key: "exp", expected: true },
						{ key: "iat", expected: true },
					];

					propertiesToCheck.forEach(({ key, expected }) => {
						if (key === "exp" || key === "iat") {
							expect(decodedToken[key]).toBeDefined();
						} else {
							expect(decodedToken[key]).toBe(expected);
						}
					});
				}

			});
		});
	})

	afterAll(() => {
		closePool;
	});
})