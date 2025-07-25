import {createContext, useContext} from "react";

const MainContext = createContext()
 
const ClientMessage = (msg, send) => {
    new Promise(function () {
        const https = new XMLHttpRequest();
        https.open("POST", `https://es_garagev2/` + msg);
        https.send(send);
    });
};// ${GetParentResourceName()}

export {
    MainContext,
    useContext,
    ClientMessage
}