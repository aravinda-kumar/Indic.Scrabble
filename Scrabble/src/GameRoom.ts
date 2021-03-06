//---------------------------------------------------------------------------------------------
// <copyright file="GameRoom.ts" company="Chandam-????">
//    Copyright � 2013 - 2018 'Chandam-????' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from 'react';
import * as Contracts from 'Contracts';
import * as Cabinet from 'Cabinet';
import * as Board from 'Board';
import * as InfoBar from 'InfoBar';
import * as GamePlayers from 'GamePlayers';
import * as ActionBar from 'ActionBar';
import * as GameTable from 'GameTable';
import * as Alert from 'AlertDialog';
import * as Confirm from 'ConfirmDialog';
import * as Suggest from 'SuggestionForm';
import * as Util from 'Util';
import * as GA from 'GenericActions';
import * as ConsentForm from 'ConsentForm';
import * as M from 'Messages';

class GameRoom extends React.Component<Contracts.iGameState, Contracts.iGameState> {
    constructor(props: Contracts.iGameState) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var gameTable = React.createElement(((GameTable.default as any) as React.ComponentClass<Contracts.iGameTable>), Util.Util.Merge(this.props.GameTable, { ReadOnly: this.props.GameTable.ReadOnly || this.props.ReadOnly }));
        childs.push(gameTable);

        var board = React.createElement(((Board.default as any) as React.ComponentClass<Contracts.iBoardProps>), Util.Util.Merge(this.props.Board, { ReadOnly: this.props.Board.ReadOnly || this.props.ReadOnly }));
        childs.push(board);

        var actionBar = React.createElement(((ActionBar.default as any) as React.ComponentClass<Contracts.iActionBar>), Util.Util.Merge(this.props.Stats, { key: "actionBar", ReadOnly: this.props.ReadOnly }));
        childs.push(actionBar);

        var words = React.createElement(((GamePlayers.default as any) as React.ComponentClass<Contracts.iPlayers>), Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: true, showWordsList: true, ReadOnly: this.props.ReadOnly }));
        childs.push(words);

        var cabinet = React.createElement(((Cabinet.default as any) as React.ComponentClass<Contracts.iCabinetProps>), Util.Util.Merge(this.props.Cabinet, { ReadOnly: this.props.Cabinet.ReadOnly || this.props.ReadOnly }));
        childs.push(cabinet);

        var info = React.createElement(((InfoBar.default as any) as React.ComponentClass<Contracts.iInfoBar>), this.props.InfoBar);
        childs.push(info);

        var dialog = React.createElement(((Alert.default as any) as React.ComponentClass<Contracts.iAlert>), Util.Util.Merge(this.props.Dialog, { OnConfirm: GA.GenericActions.OnDismissDialog }));
        childs.push(dialog);

        var consent = React.createElement(((ConsentForm.default as any) as React.ComponentClass<Contracts.iConsent>), this.props.Consent);
        childs.push(consent);

        var suggest = React.createElement(((Suggest.default as any) as React.ComponentClass<Contracts.iSuggestion>), this.props.Suggestion);
        childs.push(suggest);
            
        var block = React.createElement('div',
            {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: M.Messages.Brand
            }, childs);
        return block;
    }
}
export default GameRoom;