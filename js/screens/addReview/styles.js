import { colors } from '../../../parameters';

export default {
  mapWrapper: {
    height: 150,
  },
  content: {
    backgroundColor: colors.white,
  },
  group: {
    marginTop: 10,
  },
  addressWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.whiteTransparent,
  },
  addressIcon: {
    fontSize: 14,
    color: colors.grey,
  },
  addressText: {
    fontSize: 10,
    marginLeft: 8,
  },
  reviewWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    lineHeight: 26,
  },
  tagWrapper: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagesWrapper: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  image: (full = false, index) => ({
    marginLeft: !full || index !== 0 ? 8 : 0,
  }),
  imagesCaption: {
    fontSize: 14,
    fontWeight: '400',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  icon: {
    color: colors.white,
  },
};
