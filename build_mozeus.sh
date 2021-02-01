#! /bin/bash
sh push.sh -b

NOW=$(date +"%d-%b-%Y")
CURRENT_DIRECTORY=${PWD##*/}
ARCHIVE_NAME=$CURRENT_DIRECTORY"-win-"$NOW
temparchive=${ARCHIVE_NAME// /_}

echo "Building Win archive ..."

if [ ! -f "./$temparchive.zip" ];
then
    echo "File not found!"
else
echo "File exist. Removing"
rm "./$temparchive.zip"
fi

#to prepend "ms-appdata:///local/" prefix
cp index.js temp.js
#echo "Modifying pathnames the manual way ..."
#sed -f modify_animationsheet_audio_pathnames.sed temp.js > index.js

zip -r "./$temparchive.zip" ./index.html ./index.css ./index.js ./howler.min.js ./os.js ./*.jpg ./*.png ./*.PNG ./*.gif ./*.ogg ./*.mp3 ./*.wav ./*.ttf ./*.svg ./*.otf ./*.eot ./*.woff ./*.woff2

cp temp.js index.js
rm temp.js

#cp temp.js index.html
#rm temp.html

echo "Done"