﻿//---------------------------------------------------------------------------------------------
// <copyright file="_AlertDialog.ts" company="Chandam-ఛందం">
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
import * as OverlayDialog from '_OverlayDialog';

class _AlertDialog extends OverlayDialog.default<Contracts._iAlertDialog, Contracts._iAlertDialog>
{
    constructor(props: Contracts._iAlertDialog) {
        super(props);
        this.state = props;
    }

    render() {
        var message = React.createElement('div',
            {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);

        return this.renderDialog(message);
    }
}
export default _AlertDialog;