﻿<%
//---------------------------------------------------------------------------------------------
// <copyright file="Default.aspx" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Feb-2018 13:59EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
%>
<%@ Page Language="C#" AutoEventWireup="true" Inherits="Scrabble.Server.StaticPage" EnableViewState="false" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <title>padakaeLi ~ Scrabble for Indic Languages</title>
    <meta id="keywords" name="keywords" content="Scrabble, Telugu, Kannada and Hindi" />
    <meta id="description" name="description" content="Play Scrabble in Indian Languages" />
    <meta name="author" content="5-69Dileep Miriyala(దిలీపు మిరియాల)" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="Miriyam.ico" />
    <link href="styles/css/index.min.css" type="text/css" rel="stylesheet" />
    <link href="styles/scrabble.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="/Config.ashx?Home"></script>
    <script type="text/javascript" src="scripts/require.js"></script>
    <script type="text/javascript" src="scripts/scrabble.js"></script>
    <script type="text/javascript" async="async" src="https://www.googletagmanager.com/gtag/js?id=UA-118249672-1"></script>
</head>
<body>
    <div class="brand"><h2 class="h2">padakaeLi ~ పదకేళి</h2></div>
    <div id="list">
        <h3> Loading... </h3>
    </div>
    <script type="text/template" id="langTemplate">
        <ul class="list">
            <li>
                <h3>Board Size:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <select id="boards" class="list">
                                    <#%for(var index in this.Boards) {%#>
                                    <option value="<#%this.Boards[index]%#>"><#%this.Boards[index]%#></option>
                                    <#%}%#>
                                </select>
                            </th>
                        </tr>
                    </thead>
                </table>
            </li>
            <#%for(var indx in this.Langs) {%#>
            <li>
                <h3><#%this.Strings[this.Langs[indx]].LangName%#></h3>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <select id="<#%this.Langs[indx]%#>.player1" class="list">
                                    <option value="player" selected="selected"><#%this.Strings[this.Langs[indx]].PlayerFull%#></option>
                                    <optgroup label="<#%this.Strings[this.Langs[indx]].Bots%#>">
                                        <#%for(var index in this.Bots[this.Langs[indx]]) {%#>
                                        <option value="<#%this.Bots[this.Langs[indx]][index].Id%#>"><#%this.Bots[this.Langs[indx]][index].FullName%#></option>
                                        <#%}%#>
                                    </optgroup>
                                </select>
                            </th>
                           </tr>
                        <tr>
                            <th><#%this.Strings[this.Langs[indx]].Against%#></th>
                        </tr>
                             <tr>
                            <th>
                                <select id="<#%this.Langs[indx]%#>.player2" class="list">
                                    <option value="player" selected="selected"><#%this.Strings[this.Langs[indx]].PlayerFull%#></option>
                                    <optgroup label="<#%this.Strings[this.Langs[indx]].Bots%#>">
                                        <#%for(var index in this.Bots[this.Langs[indx]]) {%#>
                                        <option value="<#%this.Bots[this.Langs[indx]][index].Id%#>"  <#%if(index==0){%#>selected="selected"<#%}%#>><#%this.Bots[this.Langs[indx]][index].FullName%#></option>
                                        <#%}%#>
                                    </optgroup>
                                </select>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="3">
                                <button -lang="<#%this.Langs[indx]%#>" id="<#%this.Langs[indx]%#>.Play"><#%this.Strings[this.Langs[indx]].Play%#></button>
                            </th>
                        </tr>
                    </thead>
                </table>
            </li>
            <#%}%#>
        </ul>
    </script>
    <div class="footer">
        <br />
        <br />
        <br />
        <br />
        <br />
        <span class="author">~ Dileep Miriyala(దిలీపు మిరియాల)</span>
    </div>
    <script>require(['Index'])</script>
    <script>window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', 'UA-118249672-1');</script>
</body>
</html>