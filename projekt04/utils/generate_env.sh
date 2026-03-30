#!/usr/bin/env bash
# I am intransigent and using windows therefore I will do all of this manually. but it shall stay for it is a humble bash file
# i take back my last comment because i forgot what git bash was, and that i had it
echo PORT=1234
echo SECRET=$(cat /dev/random | tr -cd "[:graph:]" | head -c64)
echo PEPPER=$(cat /dev/random | tr -cd "[:xdigit:]" | head -c64)