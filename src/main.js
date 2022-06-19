import CreateGoReq from "./createGoReq/createGoReq";
export function acat_req(reqs, baseOpt) {
    return new CreateGoReq(reqs, baseOpt);
}
window.acat_req = acat_req;