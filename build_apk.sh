#!/bin/bash
echo $SHELL
if [ -n "$1" ]; then
		if [ -f $1 ]; then
			echo "file exists, unzipping..."
			unzip $1 -d app
			if [ -f $3 ]; then
				cp $3 app/assets/buildApp.txt
			else
				echo "buildApp.txt does not exist, exiting"
				exit
			fi
			if [ -f $4 ]; then
				cp $4 app/assets/logo.png
			else
				echo "no logo, proceeding regardless"
			fi
			cd app
			zip ../mod_app.apk * -r
			cd ../
			if [ -f signed_mod_app.apk ]; then
				rm signed_mod_app.apk
			fi
			signapk.sh $(pwd)/mod_app.apk
			if [ -n $2 ]; then
				mv signed_mod_app.apk $2
			fi
			rm -rv app/
			rm -rv mod_app.apk
		else
			echo "File not found, please supply valid APK file name"
			echo "Usage: build_apk.sh source_apk output_apk"
		fi
else
	echo "No apk name given"
fi
