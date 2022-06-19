import CreateGoReq from "./createGoReq/createGoReq";
export default function acatReq(reqs, baseOpt) {
    return new CreateGoReq(reqs, baseOpt);
}

window.acatReq = acatReq;

