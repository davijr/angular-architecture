import { DomsAccrualBasis } from "../doms/DomsAccrualBasis";
import { DomsCcyConvType } from "../doms/DomsCcyConvType";
import { DomsSystemType } from "../doms/DomsSystemType";
import { Model } from "../Model";
import { SysCurrency } from "../sys/SysCurrency";
import { SysCurve } from "../sys/SysCurve";
import { SysCurveUnderlyingLink } from "../sys/SysCurveUnderlyingLink";
import { SysExternalSystem } from "../sys/SysExternalSystem";
import { SysUnderlying } from "../sys/SysUnderlying";
import { SysUnderlyingType } from "../sys/SysUnderlyingType";
import { RequestModel } from "./RequestModel";

export class ModelUtils {

    private static readonly modelInstances: any = {
        // doms
        'DomsSystemType': new DomsSystemType(),
        'DomsAccrualBasis': new DomsAccrualBasis(),
        'DomsCcyConvType': new DomsCcyConvType(),
        // sys
        'SysExternalSystem': new SysExternalSystem(),
        'SysCurrency': new SysCurrency(),
        'SysCurve': new SysCurve(),
        'SysCurveUnderlyingLink': new SysCurveUnderlyingLink(),
        'SysUnderlying': new SysUnderlying(),
        'SysUnderlyingType': new SysUnderlyingType()
    };

    public static getModelInstance(context: any, modelName: string) {
        context.model = this.modelInstances[modelName];
    }

    public static parseToRequest(modelName: string, data: any): RequestModel {
        return {
            model: modelName,
            data: data
        }
    }

    public static parseModel(modelRef: any, modelFrom: any) {
      const newModel: any = Object.assign({}, modelFrom);
      Object.keys(modelRef).forEach((keyName: any) => {
        newModel[keyName] = modelRef[keyName];
      });
      return newModel;
    }
}