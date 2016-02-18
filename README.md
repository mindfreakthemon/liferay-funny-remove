# liferay-funny-remove

> A npm package that provides CLI functionality for quick removal of WCs, WCs' versions and layouts in Liferay remotely via JSONWS API.

## Install

```bash
npm i -g liferay-funny-remove
```

## Usage

Usage: `liferay-funny-remove <command> [options]`

#### Commands:

| Command | Description |
| --- | --- |
| remove-wcs <filename>  | remove web contents listed in given CSV file |
| remove-wc-versions <filename> | remove web contents' versions listed in given CSV file, but spare first N versions with --spare (defaults to 1) |
| remove-layouts <filename> | remove layouts listed in given CSV file |

#### Options:
```
  --username, -u  liferay admin username                              [required]
  --password, -p  liferay admin username                              [required]
  --url, -l       liferay hostname                                    [required]
  --groupId, -g   liferay group id                           [number] [required]
  -h, --help      Show help                                            [boolean]
```

Examples:

Please note, you have to pass `-u *admin* -p *pass* -l *myliferayhostname.com* -g *gropuId*` to all commands for it to work!

| Command example | Description |
| --- | --- |
| liferay-funny-remove remove-wcs remove-wcs.csv  | remove webcontents |
| liferay-funny-remove remove-wc-versions remove-wc-versions.csv -s 3 | remove all versions but last 3 |
| liferay-funny-remove remove-layouts remove-layouts.csv | remove all layouts |

Example remove-wcs.csv file (contains articleId-s):

```
MY-BIG-WEB-CONTENT1
MY-BIG-WEB-CONTENT2
```

Example remove-wc-versions.csv file (contains articleId-s tabbed to version):
```
MY-BIG-WEB-CONTENT	1.9
MY-BIG-WEB-CONTENT	1.8
MY-BIG-WEB-CONTENT	1.7
MY-BIG-WEB-CONTENT	1.6
MY-BIG-WEB-CONTENT	1.5
MY-BIG-WEB-CONTENT	1.4
MY-BIG-WEB-CONTENT	1.3
MY-BIG-WEB-CONTENT	1.2
MY-BIG-WEB-CONTENT	1.1
MY-BIG-WEB-CONTENT	1
```

Example remove-layouts.csv file (contains layoutId-s):
```
12345
12346
```


## License

[MIT](http://vjpr.mit-license.org)
