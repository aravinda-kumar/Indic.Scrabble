﻿//---------------------------------------------------------------------------------------------
// <copyright file="Printer.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using Scrabble.Server;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace Scrabble
{
	internal class Printer
	{
		static StreamWriter SW;

		static Printer()
		{
			string path = ServerUtil.Path("log.txt");
			FileInfo FI = new FileInfo(path);
			SW = new StreamWriter(FI.FullName, FI.Exists, Encoding.UTF8);
		}

		internal static void PrintLine(string content)
		{
#if DEBUG
			Debug.WriteLine(content);
#else
			try
			{
				if (SW != null)
				{
					SW.WriteLine(content);
					SW.Flush();
				}
			}
			catch
			{
				//Ignore..
			}
#endif
		}
	}
}
