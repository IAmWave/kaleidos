#!/bin/bash
# a script used to automatically modify the images original into a standardized format
cd orig
for FILE in *; do
    if [ ! -f "../$FILE" ]; then
        echo "Updating $FILE"
        # modulate's second argument modifies saturation
        convert "$FILE" \
            -quality 50 \
            -resize 500x500! \
            -blur 0x7 \
            -modulate 100,175 \
            "../$FILE"
    fi
done