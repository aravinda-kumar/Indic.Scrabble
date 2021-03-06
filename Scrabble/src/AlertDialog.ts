﻿//---------------------------------------------------------------------------------------------
// <copyright file="AlertDialog.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 30-Apr-2018 20:10EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from 'react';
import * as Contracts from 'Contracts';
import * as _AlertDialog from '_AlertDialog';
import * as Util from 'Util';
import * as Messages from 'Messages';

class AlertDialog extends React.Component<Contracts.iAlert, Contracts.iAlert>
{
    constructor(props: Contracts.iAlert) {
        super(props);
        this.state = props;
    }

    render() {
        var id: string = "AlertDialog";
        return React.createElement(((_AlertDialog.default as any) as React.ComponentClass<Contracts.iAlert>), Util.Util.Merge(this.props,
            {
                Id: id,
                key: id,
                ref: id,
                className: id,
                ReadOnly: false,
                //
                ShowClose: false,
                ConfirmText: Messages.Messages.OK, ShowConfirm: true,
                OnConfirm: this.props.OnConfirm,
            }));
    }
}
export default AlertDialog;